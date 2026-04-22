-- Pont AI SaaS Database Schema
-- v2.0 Cloud-Native Elastic Architecture

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector"; -- For RAG functionality

-- 1. Tenants table
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name TEXT NOT NULL,
    industry TEXT,
    org_size TEXT,
    plan_id TEXT NOT NULL DEFAULT 'entry_999',
    status TEXT NOT NULL CHECK (status IN ('trial', 'active', 'frozen', 'deleted')),
    trial_ends_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password_hash TEXT NOT NULL,
    full_name TEXT,
    role TEXT NOT NULL DEFAULT 'admin', -- 'admin' or 'user'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Subscriptions table
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    plan_id TEXT NOT NULL,
    period TEXT NOT NULL CHECK (period IN ('monthly', 'quarterly', 'annual')),
    start_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_at TIMESTAMP WITH TIME ZONE,
    amount DECIMAL(12, 2) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('active', 'past_due', 'canceled'))
);

-- 4. Orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL,
    payment_method TEXT NOT NULL, -- 'wechat', 'alipay', 'stripe'
    paid_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    invoice_id TEXT UNIQUE
);

-- 5. Quotas table
CREATE TABLE quotas (
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    resource_type TEXT NOT NULL, -- 'content_gen', 'cs_chat', 'geo_monitoring', 'kb_docs'
    period TEXT NOT NULL DEFAULT 'monthly',
    total INTEGER NOT NULL,
    used INTEGER NOT NULL DEFAULT 0,
    overage_billed INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (tenant_id, resource_type)
);

-- 6. Tasks table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    payload JSONB,
    result JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- 7. Knowledge Base (RAG) table
CREATE TABLE kb_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    metadata JSONB,
    embedding VECTOR(1536), -- Dimension for text-embedding-3-small
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Worker heartbeats (for monitoring)
CREATE TABLE workers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pod_name TEXT NOT NULL,
    status TEXT NOT NULL,
    current_task_id UUID,
    heartbeat_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Account pool
CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform TEXT NOT NULL, -- 'wechat', 'red', etc
    status TEXT NOT NULL,
    assigned_at TIMESTAMP WITH TIME ZONE,
    last_used_at TIMESTAMP WITH TIME ZONE
);

-- 10. Proxy pool
CREATE TABLE proxies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL,
    region TEXT NOT NULL,
    status TEXT NOT NULL,
    bandwidth_used BIGINT DEFAULT 0
);

-- Row Level Security (RLS) Configuration
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotas ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE kb_embeddings ENABLE ROW LEVEL SECURITY;

-- Dynamic Policy: use 'app.current_tenant_id' session variable
-- To be set by backend middleware: SET app.current_tenant_id = '...'

CREATE POLICY tenant_isolation_policy ON users FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
CREATE POLICY tenant_isolation_policy ON subscriptions FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
CREATE POLICY tenant_isolation_policy ON orders FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
CREATE POLICY tenant_isolation_policy ON quotas FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
CREATE POLICY tenant_isolation_policy ON tasks FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
CREATE POLICY tenant_isolation_policy ON kb_embeddings FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
