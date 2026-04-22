# PONT AI: Internal Strategy Document

## 1. Executive Summary
PONT AI is a next-generation SaaS platform designed for high-efficiency business automation. Unlike traditional platforms that require one VPS per customer, PONT uses a modern "Event-Driven" architecture.

## 2. Financial Targets
- **Price Point**: $999/month
- **Gross Margin Target**: 92% or higher.
- **Infrastructure Cost Goal**: Reduce cost per customer from 400 RMB to 30-80 RMB.

## 3. Core Technology (Xia Engine)
The Xia engine is the brain of the platform. It handles:
- **GEO Keyword Analysis**: Tracking local market trends.
- **Content Generation**: Creating SEO-optimized marketing materials.
- **Knowledge Base RAG**: Allowing users to chat with their private documents securely.

## 4. Security & Privacy
- **Isolation**: Every tenant is isolated using PostgreSQL Row Level Security (RLS).
- **Encryption**: All sensitive API keys are stored as Kubernetes Secrets.
- **Data Policy**: No data is shared between different organization IDs.
