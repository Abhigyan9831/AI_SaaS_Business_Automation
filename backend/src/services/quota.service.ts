import { PoolClient } from 'pg';

export class QuotaService {
  async checkQuota(client: PoolClient, tenantId: string, resourceType: string): Promise<boolean> {
    const res = await client.query(
      'SELECT used, total FROM quotas WHERE tenant_id = $1 AND resource_type = $2',
      [tenantId, resourceType]
    );
    
    if (res.rows.length === 0) return false;
    
    const { used, total } = res.rows[0];
    return used < total;
  }

  async debitQuota(client: PoolClient, tenantId: string, resourceType: string, amount: number = 1) {
    await client.query(
      'UPDATE quotas SET used = used + $1 WHERE tenant_id = $2 AND resource_type = $3',
      [amount, tenantId, resourceType]
    );
  }

  async resetMonthlyQuotas(client: PoolClient) {
    // PDF 5.4: Reset used count every month
    await client.query('UPDATE quotas SET used = 0 WHERE period = \'monthly\'');
  }

  async getUsage(client: PoolClient, tenantId: string) {
    const res = await client.query(
      'SELECT resource_type, used, total, overage_billed FROM quotas WHERE tenant_id = $1',
      [tenantId]
    );
    return res.rows;
  }
}
