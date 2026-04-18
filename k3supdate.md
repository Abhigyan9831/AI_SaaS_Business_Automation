# K3s Deployment Proof

## 1. Node Ready
![Node Ready](./node-ready.png)

\```bash
kubectl get nodes
\```

## 2. nginx Pod Running
![Pod Running](./pod-running.png)

\```bash
kubectl get pods
kubectl get svc
\```

## 3. nginx Welcome Page
![nginx Welcome](./nginx-welcome.png)

\```bash
curl http://<VM_IP>:30080
\```

## Summary
| Check | Status |
|-------|--------|
| Node Ready | ✅ |
| Pod Running | ✅ |
| NodePort Accessible | ✅ |
