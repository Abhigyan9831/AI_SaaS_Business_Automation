import { Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import { exec } from 'child_process';
import { promisify } from 'util';

dotenv.config();

const execPromise = promisify(exec);

const redisConnection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null,
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Mock Xia Invocation Logic (Black Box)
const invokeXia = async (taskId: string, tenantId: string, type: string, payload: any) => {
  console.log(`[Xia] Invoking for Task: ${taskId}, Tenant: ${tenantId}, Type: ${type}`);
  
  // In a real scenario, this might be:
  // await execPromise(`docker run --rm xia-engine --task ${type} --payload '${JSON.stringify(payload)}'`);
  
  // For demonstration, we simulate processing time and return a dummy result
  await new Promise((resolve) => setTimeout(resolve, 5000)); 

  return {
    success: true,
    data: {
      content: `Generated content for ${type} task.`,
      xia_version: 'v2.0',
    },
    metrics: {
      duration_ms: 5000,
      tokens_used: 1250,
    }
  };
};

const worker = new Worker('xia-tasks', async (job: Job) => {
  const { taskId, tenantId, type, payload } = job.data;
  console.log(`[Worker] Processing Job ${job.id} (Task ${taskId})`);

  try {
    // 1. Mark task as 'processing' and set tenant context for RLS
    const client = await pool.connect();
    try {
      await client.query(`SET app.current_tenant_id = '${tenantId}'`);
      await client.query('UPDATE tasks SET status = $1 WHERE id = $2', ['processing', taskId]);

      // 2. Invoke Xia
      const result = await invokeXia(taskId, tenantId, type, payload);

      // 3. Store result and mark complete
      await client.query(
        'UPDATE tasks SET status = $1, result = $2, completed_at = NOW() WHERE id = $3',
        ['completed', JSON.stringify(result), taskId]
      );

      // 4. Update Quota
      await client.query(
        'UPDATE quotas SET used = used + 1 WHERE tenant_id = $1',
        [tenantId]
      );

      console.log(`[Worker] Task ${taskId} completed successfully.`);
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(`[Worker] Task ${taskId} failed:`, err);
    // Update task status to failed
    const client = await pool.connect();
    try {
      await client.query(`SET app.current_tenant_id = '${tenantId}'`);
      await client.query('UPDATE tasks SET status = $1 WHERE id = $2', ['failed', taskId]);
    } finally {
      client.release();
    }
    throw err;
  }
}, { connection: redisConnection });

console.log('Worker service started and listening for tasks...');
