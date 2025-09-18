# CI/CD — GitHub Actions

A single workflow (`.github/workflows/ci-cd.yml`) builds the Next.js frontend and Express backend, builds & pushes Docker images to Docker Hub, then deploys the Kubernetes manifests to AKS (`tony-expensy` in RG `tony-expensy-aks`).

## Required GitHub Secrets
- `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN` — push images
- `AZURE_CREDENTIALS` — auth to Azure/AKS for `kubectl apply`
- (Optional) App secrets injected at deploy time (e.g., `DATABASE_URI`, `REDIS_PASSWORD`) if your workflow templates them

## Outcome
- Images published: `lordvetonn/expensy-frontend`, `lordvetonn/expensy-backend`
- Manifests in `k8s/k8s/` applied
- Frontend Service (LoadBalancer) updated; backend/data remain internal
