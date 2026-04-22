import { Pool } from 'pg';

export class TenantService {
  constructor(private pool: Pool) {}

  async createTenant(companyName: string, industry?: string, orgSize?: string, planId: string = 'entry_999') {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      
      // 1. Create Tenant (Trial mode)
      const tenantRes = await client.query(
        'INSERT INTO tenants (company_name, industry, org_size, plan_id, status, trial_ends_at) VALUES ($1, $2, $3, $4, $5, NOW() + interval \'30 days\') RETURNING *',
        [companyName, industry, orgSize, planId, 'trial']
      );
      const tenant = tenantRes.rows[0];

      // 2. Initialize Quotas (PDF 5.4 Overage Pricing Table)
      // Entry 999 Defaults
      const quotas = [
        { type: 'content_gen', total: 100 },
        { type: 'cs_chat', total: 500 },
        { type: 'geo_monitoring', total: 5 },
        { type: 'platform_connections', total: 2 },
        { type: 'kb_documents', total: 10 },
      ];

      for (const q of quotas) {
        await client.query(
          'INSERT INTO quotas (tenant_id, resource_type, total) VALUES ($1, $2, $3)',
          [tenant.id, q.type, q.total]
        );
      }

      await client.query('COMMIT');
      return tenant;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async upgradePlan(tenantId: string, planId: string, period: string) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      // 1. Update Plan Info
      await client.query(
        'UPDATE tenants SET plan_id = $1, status = \'active\' WHERE id = $2',
        [planId, tenantId]
      );

      // 2. Define Quotas based on Plan (PDF 5.4)
      let quotas = [];
      if (planId === 'pro_2999') {
        quotas = [
          { type: 'content_gen', total: 500 },
          { type: 'cs_chat', total: 3000 },
          { type: 'geo_monitoring', total: 50 },
          { type: 'platform_connections', total: 10 },
          { type: 'kb_documents', total: 100 },
        ];
      } else if (planId === 'flagship_9999') {
        quotas = [
          { type: 'content_gen', total: 999999 }, // Unlimited representation
          { type: 'cs_chat', total: 999999 },
          { type: 'geo_monitoring', total: 999999 },
          { type: 'platform_connections', total: 999999 },
          { type: 'kb_documents', total: 999999 },
        ];
      } else {
        // Default to Entry
        quotas = [
          { type: 'content_gen', total: 100 },
          { type: 'cs_chat', total: 500 },
          { type: 'geo_monitoring', total: 5 },
          { type: 'platform_connections', total: 2 },
          { type: 'kb_documents', total: 10 },
        ];
      }

      // 3. Upsert Quotas
      for (const q of quotas) {
        await client.query(
          'INSERT INTO quotas (tenant_id, resource_type, total, used) VALUES ($1, $2, $3, 0) ON CONFLICT (tenant_id, resource_type) DO UPDATE SET total = $3, used = 0',
          [tenantId, q.type, q.total]
        );
      }

      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async getTenant(tenantId: string) {
    const res = await this.pool.query('SELECT * FROM tenants WHERE id = $1', [tenantId]);
    return res.rows[0];
  }
}
