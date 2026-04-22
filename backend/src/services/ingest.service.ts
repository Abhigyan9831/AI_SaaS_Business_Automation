import { PoolClient } from 'pg';

export class IngestService {
  async processFile(client: PoolClient, tenantId: string, filename: string, content: string) {
    // PDF 4.1: data ingested to KB (pgvector chunk + embed)
    console.log(`[Ingest] Processing file ${filename} for tenant ${tenantId}`);

    // 1. Chunk content (Simple demo chunker)
    const chunks = content.match(/[\s\S]{1,1000}/g) || [];

    for (const chunk of chunks) {
      // 2. Store in DB with RLS context
      // Note: later replace with real embeddings from OpenAI/DeepSeek
      await client.query(
        'INSERT INTO kb_embeddings (tenant_id, content, metadata) VALUES ($1, $2, $3)',
        [tenantId, chunk, { filename, processed_at: new Date() }]
      );
    }

    // 3. Update KB Quota
    await client.query(
      'UPDATE quotas SET used = used + 1 WHERE tenant_id = $1 AND resource_type = \'kb_documents\'',
      [tenantId]
    );

    return { success: true, chunks: chunks.length };
  }

  async searchKnowledgeBase(client: PoolClient, tenantId: string, query: string) {
    // PDF 4.1: console shows results
    // Logic for vector search would go here:
    // SELECT content FROM kb_embeddings ORDER BY embedding <=> $1 LIMIT 5
    const res = await client.query(
      'SELECT content, metadata FROM kb_embeddings LIMIT 5'
    );
    return res.rows;
  }
}
