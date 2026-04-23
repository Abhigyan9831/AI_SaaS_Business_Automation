import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { Pool, PoolClient } from 'pg';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import bcrypt from 'bcryptjs';
import Stripe from 'stripe';

import { TenantService } from './services/tenant.service';
import { AuthService } from './services/auth.service';
import { QuotaService } from './services/quota.service';
import { StateService } from './services/state.service';
import { IngestService } from './services/ingest.service';
import { MailService } from './services/mail.service';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('⚠️ STRIPE_SECRET_KEY is missing. Payment features will be disabled.');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'dummy_key', {
  apiVersion: '2024-04-10' as any,
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const redisConnection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null,
});

const taskQueue = new Queue('xia-tasks', { connection: redisConnection });

const tenantService = new TenantService(pool);
const authService = new AuthService();
const quotaService = new QuotaService();
const mailService = new MailService();
const stateService = new StateService(pool, mailService);
const ingestService = new IngestService();

stateService.init();

app.use(helmet());
app.use(cors());
app.use((req, res, next) => {
  if (req.originalUrl === '/api/webhooks/payment') {
    next();
  } else {
    express.json()(req, res, next);
  }
});
app.use(morgan('dev'));

const authenticate = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  let client: PoolClient | null = null;

  try {
    const decoded = authService.verifyToken(token);
    const tenantStatus = await stateService.getTenantStatus(decoded.tenantId);
    
    if (!tenantStatus) return res.status(404).json({ error: 'Tenant not found' });
    if (tenantStatus.status === 'frozen' || tenantStatus.status === 'deleted') {
      return res.status(403).json({ error: `Account ${tenantStatus.status}. Access denied.`, code: 'ACCOUNT_INACTIVE' });
    }

    client = await pool.connect();
    await client.query(`SET app.current_tenant_id = '${decoded.tenantId}'`);

    (req as any).user = decoded;
    (req as any).tenantId = decoded.tenantId;
    (req as any).db = client;
    
    const originalSend = res.send;
    res.send = function(...args) {
      if (client) { client.release(); client = null; }
      return originalSend.apply(res, args);
    };

    next();
  } catch (err) {
    if (client) client.release();
    res.status(401).json({ error: 'Invalid session' });
  }
};

app.post('/api/register', async (req, res) => {
  const { companyName, industry, orgSize, email, phone, password } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create Tenant
    const tenantRes = await client.query(
      'INSERT INTO tenants (company_name, industry, org_size, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [companyName, industry, orgSize, 'trial']
    );
    const tenant = tenantRes.rows[0];

    // Create Admin User
    const userRes = await client.query(
      'INSERT INTO users (tenant_id, email, phone, password_hash, full_name) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, role',
      [tenant.id, email, phone, hashedPassword, companyName]
    );
    const user = userRes.rows[0];

    // Initialize Quotas
    const quotas = [
      ['content_gen', 5],
      ['cs_chat', 100],
      ['geo_monitoring', 5],
      ['kb_documents', 3],
      ['aeo_audit', 2],
      ['site_health', 1]
    ];
    for (const [type, limit] of quotas) {
      await client.query(
        'INSERT INTO quotas (tenant_id, resource_type, total, used) VALUES ($1, $2, $3, 0)',
        [tenant.id, type, limit]
      );
    }

    await client.query('COMMIT');
    
    // 📩 Send Welcome Email (fire-and-forget)
    mailService.sendWelcomeEmail(email, companyName).catch(e => console.error('[Mail] Welcome email failed:', e));

    const token = authService.generateToken({ userId: user.id, tenantId: tenant.id, role: user.role });
    res.status(201).json({ tenant, user, token });
  } catch (err: any) {
    await client.query('ROLLBACK');
    console.error('[Register] Error:', err.message);
    res.status(500).json({ error: err.message || 'Registration failed' });
  } finally {
    client.release();
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (user && await bcrypt.compare(password, user.password_hash)) {
      const token = authService.generateToken({ userId: user.id, tenantId: user.tenant_id, role: user.role });
      res.json({ user: { id: user.id, email: user.email, role: user.role }, token });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err: any) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// AEO & SEO Monitoring Routes
app.get('/api/monitoring/audit', authenticate, async (req: any, res) => {
  try {
    const result = await req.db.query('SELECT * FROM site_audits ORDER BY created_at DESC LIMIT 10');
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/monitoring/ranks', authenticate, async (req: any, res) => {
  try {
    const result = await req.db.query('SELECT * FROM rank_tracking ORDER BY created_at DESC LIMIT 50');
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/tasks', authenticate, async (req: any, res) => {
  const { type, payload } = req.body;
  try {
    const hasQuota = await quotaService.checkQuota(req.db, req.tenantId, type);
    if (!hasQuota) return res.status(403).json({ error: `Quota exceeded for ${type}` });

    const result = await req.db.query(
      'INSERT INTO tasks (tenant_id, type, status, payload) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.tenantId, type, 'pending', payload]
    );
    const task = result.rows[0];
    await taskQueue.add('xia-task-job', { taskId: task.id, tenantId: req.tenantId, type, payload });
    res.status(202).json(task);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/tasks', authenticate, async (req: any, res) => {
  try {
    const result = await req.db.query('SELECT * FROM tasks ORDER BY created_at DESC LIMIT 50');
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/usage', authenticate, async (req: any, res) => {
  try {
    const usage = await quotaService.getUsage(req.db, req.tenantId);
    res.json(usage);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/kb/ingest', authenticate, async (req: any, res) => {
  const { filename, content } = req.body;
  try {
    const result = await ingestService.processFile(req.db, req.tenantId, filename, content);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/payments/checkout', authenticate, async (req: any, res) => {
  const { planId, period } = req.body;
  const prices: Record<string, number> = { 'entry_999': 999, 'pro_2999': 2999, 'flagship_9999': 9999 };
  const amount = prices[planId] || 999;
  
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'cny',
          product_data: { name: `PONT AI ${planId.split('_')[0].toUpperCase()} Plan` },
          unit_amount: amount * 100,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard?payment=success`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/pricing?payment=cancel`,
      metadata: { tenantId: req.tenantId, planId, period },
    });
    res.json({ checkoutUrl: session.url });
  } catch (err: any) {
    res.status(500).json({ error: 'Could not create checkout session' });
  }
});

app.get('/api/payments/history', authenticate, async (req: any, res) => {
  try {
    const result = await req.db.query('SELECT * FROM orders ORDER BY paid_at DESC');
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/webhooks/payment', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const { tenantId, planId, period } = session.metadata!;
    try {
      await pool.query('BEGIN');
      await stateService.setTenantActive(tenantId);
      await tenantService.upgradePlan(tenantId, planId, period);
      await pool.query(
        'INSERT INTO orders (tenant_id, amount, payment_method, invoice_id) VALUES ($1, $2, $3, $4)',
        [tenantId, session.amount_total! / 100, 'stripe', session.id]
      );
      await pool.query('COMMIT');

      // 📩 Send Subscription Activation Email
      if (session.customer_details?.email) {
        await mailService.sendSubscriptionActiveEmail(session.customer_details.email, planId);
      }
    } catch (err) {
      await pool.query('ROLLBACK');
    }
  }
  res.sendStatus(200);
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`PONT AI Control Plane running on port ${port}`);
});
