# Security & Compliance — Expensy

## Secrets & Config
Application secrets (e.g., `DATABASE_URI`, `REDIS_PASSWORD`) are **not** committed. They are provided via GitHub Secrets and injected at deploy time. For production, move them into Kubernetes **Secrets** (Base64) and reference with `envFrom.secretRef`.

## Identity & Access
CI authenticates to Azure/AKS with a limited-scope credential (enough to push images and `kubectl apply`). No root/owner tokens in automation.

## Network Exposure
Only the **frontend** is public (Service `LoadBalancer`). **Backend**, **MongoDB**, and **Redis** are `ClusterIP` (internal-only). This reduces attack surface.

## Transport Security
Course demo uses HTTP. For production, add an **Ingress** and **cert-manager** (Let’s Encrypt) to terminate TLS and enforce HTTPS.

## Logging & Metrics
AKS **monitoring addon** is enabled; logs/metrics flow to **Azure Monitor (Log Analytics)** with workspace retention. In-cluster **Prometheus + Grafana** provide real-time dashboards.

## Data
For the project, MongoDB/Redis run in-cluster. Production should use managed services or PVs with encryption at rest and backups.

## Supply Chain
Images are built in CI and pushed to Docker Hub with tags. Regular base-image updates and a scanner (e.g., Trivy) are recommended.
