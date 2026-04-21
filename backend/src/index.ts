import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';

import { TenantService } from './services/tenant.service';
import { AuthService } from './services/auth.service';
import { QuotaService } from './services/quota.service';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// DB & Redis Setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const redisConnection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null,
});

const taskQueue = new Queue('xia-tasks', { connection: redisConnection });

// Services
const tenantService = new TenantService(pool);
const authService = new AuthService();
const quotaService = new QuotaService();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Multi-tenant & Auth middleware
const authenticate = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = authService.verifyToken(token);
    (req as any).user = decoded;
    (req as any).tenantId = decoded.tenantId;

    // Set tenant_id in Postgres session for RLS
    const client = await pool.connect();
    await client.query(`SET app.current_tenant_id = '${decoded.tenantId}'`);
    (req as any).db = client;
    
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'OK', services: { db: 'connected', redis: 'connected' } });
});

// Registration / Onboarding
app.post('/api/register', async (req, res) => {
  const { companyName, email, password } = req.body;
  try {
    // 1. Create Tenant & Default Quota
    const tenant = await tenantService.createTenant(companyName);
    
    // 2. Create User (Simplified for demo)
    const userRes = await pool.query(
      'INSERT INTO users (tenant_id, email, password_hash, full_name) VALUES ($1, $2, $3, $4) RETURNING *',
      [tenant.id, email, password, companyName] // Use real hash in prod
    );
    const user = userRes.rows[0];

    // 3. Generate Token
    const token = authService.generateToken({
      userId: user.id,
      tenantId: tenant.id,
      role: user.role
    });

    res.status(201).json({ tenant, user, token });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Tasks API
app.post('/api/tasks', authenticate, async (req: any, res) => {
  const { type, payload } = req.body;
  const db = req.db;

  try {
    // 1. Check Quota
    const hasQuota = await quotaService.checkQuota(db, req.tenantId, 'content_gen');
    if (!hasQuota) {
      return res.status(403).json({ error: 'Quota exceeded' });
    }

    // 2. Create Task
    const result = await db.query(
      'INSERT INTO tasks (tenant_id, type, payload) VALUES ($1, $2, $3) RETURNING *',
      [req.tenantId, type, payload]
    );
    const task = result.rows[0];

    // 3. Enqueue to BullMQ
    await taskQueue.add('xia-task-job', {
      taskId: task.id,
      tenantId: req.tenantId,
      type,
      payload,
    });

    res.status(202).json(task);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  } finally {
    db.release();
  }
});

app.get('/api/tasks', authenticate, async (req: any, res) => {
  const db = req.db;
  try {
    const result = await db.query('SELECT * FROM tasks ORDER BY created_at DESC LIMIT 50');
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  } finally {
    db.release();
  }
});

app.get('/api/usage', authenticate, async (req: any, res) => {
  const db = req.db;
  try {
    const result = await db.query('SELECT * FROM quotas WHERE tenant_id = $1', [req.tenantId]);
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  } finally {
    db.release();
  }
});

app.listen(port, () => {
  console.log(`Pont AI Control Plane running on port ${port}`);
});
