-- Pont AI SaaS Production Database Initialization
-- Strictly following PDF 4.3 Data Model & PDF 5.5 State Machine

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector"; -- Essential for RAG (Xia Deep Integration)

-- 1. Tenants (Lifecycle management)
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name TEXT NOT NULL,
    industry TEXT,
    org_size TEXT,
    plan_id TEXT NOT NULL DEFAULT 'entry_999',
    status TEXT NOT NULL DEFAULT 'trial' CHECK (status IN ('trial', 'active', 'frozen', 'deleted')),
    trial_ends_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Users (Admin vs Member)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password_hash TEXT NOT NULL,
    full_name TEXT,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Subscriptions (Billing records)
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    plan_id TEXT NOT NULL,
    period TEXT NOT NULL CHECK (period IN ('monthly', 'quarterly', 'annual')),
    start_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_at TIMESTAMP WITH TIME ZONE,
    amount DECIMAL(12, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'canceled'))
);

-- 4. Orders (Payment history)
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL,
    payment_method TEXT NOT NULL,
    paid_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    invoice_id TEXT UNIQUE
);

-- 5. Quotas (Usage limits)
CREATE TABLE quotas (
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    resource_type TEXT NOT NULL, -- content_gen, cs_chat, geo_monitoring, platform_connections, kb_documents
    period TEXT NOT NULL DEFAULT 'monthly',
    total INTEGER NOT NULL DEFAULT 0,
    used INTEGER NOT NULL DEFAULT 0,
    overage_billed INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (tenant_id, resource_type)
);

-- 6. Tasks (Job execution)
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    payload JSONB DEFAULT '{}',
    result JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- 7. Knowledge Base (RAG vectors)
CREATE TABLE kb_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    embedding VECTOR(1536), -- Optimized for text-embedding-3-small
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Worker Nodes (Health monitoring)
CREATE TABLE workers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pod_name TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'idle',
    current_task_id UUID,
    heartbeat_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Account & Proxy Pools (Isolation soft-compute)
CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'available',
    assigned_at TIMESTAMP WITH TIME ZONE,
    last_used_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE proxies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL,
    region TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    bandwidth_used BIGINT DEFAULT 0
);

-- Multi-Tenant Row Level Security (RLS)
-- Each tenant only sees their own data
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotas ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE kb_embeddings ENABLE ROW LEVEL SECURITY;

-- Note: The session variable 'app.current_tenant_id' is set by the backend middleware per request.
CREATE POLICY tenant_isolation_policy ON users FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
CREATE POLICY tenant_isolation_policy ON subscriptions FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
CREATE POLICY tenant_isolation_policy ON orders FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
CREATE POLICY tenant_isolation_policy ON quotas FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
CREATE POLICY tenant_isolation_policy ON tasks FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
CREATE POLICY tenant_isolation_policy ON kb_embeddings FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- 10. AEO & SEO Monitoring (Advanced Semrush-like features)
CREATE TABLE site_audits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    domain TEXT NOT NULL,
    health_score INTEGER DEFAULT 0,
    issues_found JSONB DEFAULT '[]',
    recommendations JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE rank_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    keyword TEXT NOT NULL,
    google_rank INTEGER,
    perplexity_mention_rate FLOAT, -- Percentage of brand mentions in AI search
    chatgpt_sentiment TEXT, -- Positive/Neutral/Negative
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Multi-Tenant RLS for new tables
ALTER TABLE site_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE rank_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_policy ON site_audits FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
CREATE POLICY tenant_isolation_policy ON rank_tracking FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
