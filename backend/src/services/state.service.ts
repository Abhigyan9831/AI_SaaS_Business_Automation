import { Pool } from 'pg';
import cron from 'node-cron';
import { MailService } from './mail.service';

export class StateService {
  constructor(private pool: Pool, private mailService: MailService) {}

  init() {
    // Schedule daily status check at midnight
    cron.schedule('0 0 * * *', () => {
      console.log('[State] Running daily lifecycle transitions...');
      this.processTransitions();
    });
  }

  async processTransitions() {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      // 📩 1. Send Reminders for Trial Ending (3 days left)
      const reminders = await client.query(`
        SELECT t.id, u.email, t.company_name, t.trial_ends_at
        FROM tenants t
        JOIN users u ON t.id = u.tenant_id
        WHERE t.status = 'trial' 
        AND t.trial_ends_at BETWEEN NOW() AND (NOW() + interval '3 days')
        AND u.role = 'admin'
      `);

      for (const row of reminders.rows) {
        await this.mailService.sendTrialEndingReminder(row.email, 3);
      }

      // 2. [Trial] -> [Frozen] if no pay in 30d
      await client.query(`
        UPDATE tenants 
        SET status = 'frozen' 
        WHERE status = 'trial' AND trial_ends_at < NOW()
      `);

      // 3. [Active] -> [Frozen] if 3d past due (arrears)
      await client.query(`
        UPDATE tenants 
        SET status = 'frozen' 
        FROM subscriptions 
        WHERE tenants.id = subscriptions.tenant_id 
        AND tenants.status = 'active' 
        AND subscriptions.status = 'past_due' 
        AND subscriptions.end_at < (NOW() - interval '3 days')
      `);

      // 4. [Frozen] -> [Deleted] after 90d
      await client.query(`
        UPDATE tenants 
        SET status = 'deleted' 
        WHERE status = 'frozen' AND created_at < (NOW() - interval '90 days')
      `);

      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('[State] Transition error:', err);
    } finally {
      client.release();
    }
  }

  async setTenantActive(tenantId: string) {
    await this.pool.query(
      'UPDATE tenants SET status = $1 WHERE id = $2',
      ['active', tenantId]
    );
  }

  async getTenantStatus(tenantId: string) {
    const res = await this.pool.query('SELECT status, trial_ends_at FROM tenants WHERE id = $1', [tenantId]);
    return res.rows[0];
  }
}
