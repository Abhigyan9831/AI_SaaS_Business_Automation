import { Pool } from 'pg';

export class TenantService {
  constructor(private pool: Pool) {}

  async createTenant(companyName: string, planId: string = 'entry_999') {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      
      // 1. Create Tenant
      const tenantRes = await client.query(
        'INSERT INTO tenants (company_name, plan_id, status, trial_ends_at) VALUES ($1, $2, $3, NOW() + interval \'30 days\') RETURNING *',
        [companyName, planId, 'trial']
      );
      const tenant = tenantRes.rows[0];

      // 2. Initialize Quota
      await client.query(
        'INSERT INTO quotas (tenant_id, resource_type, period, total) VALUES ($1, $2, $3, $4)',
        [tenant.id, 'content_gen', 'monthly', 100] // Default for entry_999
      );

      await client.query('COMMIT');
      return tenant;
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
