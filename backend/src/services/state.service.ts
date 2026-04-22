import { Pool } from 'pg';
import cron from 'node-cron';

export class StateService {
  constructor(private pool: Pool) {}

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

      // 1. [Trial] -> [Frozen] if no pay in 30d
      await client.query(`
        UPDATE tenants 
        SET status = 'frozen' 
        WHERE status = 'trial' AND trial_ends_at < NOW()
      `);

      // 2. [Active] -> [Frozen] if 3d past due (arrears)
      // Note: Arrears logic depends on subscription table status
      await client.query(`
        UPDATE tenants 
        SET status = 'frozen' 
        FROM subscriptions 
        WHERE tenants.id = subscriptions.tenant_id 
        AND tenants.status = 'active' 
        AND subscriptions.status = 'past_due' 
        AND subscriptions.end_at < (NOW() - interval '3 days')
      `);

      // 3. [Frozen] -> [Deleted] after 60d (Trial) or 90d (Active)
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
