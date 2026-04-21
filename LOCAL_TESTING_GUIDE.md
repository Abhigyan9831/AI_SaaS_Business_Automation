# Pont AI Local Testing Guide

Follow these steps to verify the entire SaaS stack on your local machine.

## 1. Start the Stack
Run the following command in the root directory:
```bash
docker-compose up --build
```
This will start:
- **Postgres 16**: Database at `localhost:5432`
- **Redis 7**: Queue at `localhost:6379`
- **Backend**: API at `localhost:3001`
- **Worker**: Task processor (watching Redis)
- **Frontend**: Dashboard at `localhost:3000`

---

## 2. Verify Database & RLS
Once the containers are up, you can verify the Multi-tenant isolation.

### A. Check Schema
Connect to Postgres:
```bash
docker exec -it pont-postgres psql -U pont_admin -d pont_db
```
Then run:
```sql
\dt -- List tables
SELECT * FROM tenants; -- Should be empty initially
```

### B. Test RLS Bypass Prevention
Try to query tasks without a tenant context:
```sql
SELECT * FROM tasks; -- This will return 0 rows because RLS is enabled and current_tenant_id is not set.
```

---

## 3. Test the Onboarding Flow
1. Open your browser to `http://localhost:3000`.
2. Complete the **4-step Onboarding**.
3. On the final step, click **"Finish"**.
4. Check the **Backend Logs** (`docker logs pont-backend`) to see:
   - `INSERT INTO tenants`
   - `INSERT INTO users`
   - `JWT Token generated`

---

## 4. Test Task Orchestration
After onboarding, the system is ready to process tasks.

### A. Submit a Task
You can use `curl` to simulate a task submission (using the token received during onboarding):
```bash
curl -X POST http://localhost:3001/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"type": "content_gen", "payload": {"topic": "SaaS Architecture"}}'
```

### B. Watch the Worker
Check the **Worker Logs** (`docker logs pont-worker`):
- You should see: `[Worker] Processing Job ... (Task ...)`
- Followed by: `[Xia] Invoking for Task ...`
- And finally: `[Worker] Task ... completed successfully.`

### C. Verify Results in DB
Connect back to Postgres and set the tenant context to see your data:
```sql
SET app.current_tenant_id = 'YOUR_TENANT_ID';
SELECT * FROM tasks;
SELECT * FROM quotas; -- 'used' should have incremented
```

---

## 5. Troubleshooting
- **Database Connection Error**: Ensure no other service is using port 5432.
- **Worker Not Picking Jobs**: Check if Redis is healthy (`docker logs pont-redis`).
- **Frontend API Errors**: Ensure `NEXT_PUBLIC_API_URL` is set to `http://localhost:3001` in your environment.
