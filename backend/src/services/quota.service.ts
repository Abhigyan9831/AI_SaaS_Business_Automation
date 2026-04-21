import { PoolClient } from 'pg';

export class QuotaService {
  async checkQuota(client: PoolClient, tenantId: string, resourceType: string): Promise<boolean> {
    const res = await client.query(
      'SELECT total, used FROM quotas WHERE tenant_id = $1 AND resource_type = $2',
      [tenantId, resourceType]
    );

    if (res.rows.length === 0) return false;
    
    const { total, used } = res.rows[0];
    return used < total;
  }

  async incrementUsed(client: PoolClient, tenantId: string, resourceType: string, amount: number = 1) {
    await client.query(
      'UPDATE quotas SET used = used + $1, updated_at = NOW() WHERE tenant_id = $2 AND resource_type = $3',
      [amount, tenantId, resourceType]
    );
  }
}
