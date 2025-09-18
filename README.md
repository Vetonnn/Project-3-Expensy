Expensy – End-to-End DevOps Deployment

Expensy is a simple expense-tracking application delivered as a full DevOps project. The solution includes a Next.js frontend and a Node/Express backend, packaged as containers, built and deployed through GitHub Actions, run on Azure Kubernetes Service (AKS), and observed with Prometheus/Grafana and Azure Monitor.

What this project demonstrates

A clear separation between a browser-facing Next.js frontend and an Express API backend.

Repeatable container builds and automated delivery through a single CI/CD pipeline.

Production-style Kubernetes manifests for the app, data services, and networking on AKS.

Observability via in-cluster Prometheus/Grafana dashboards and centralized logging/metrics in Azure.

Practical security choices: secrets kept out of source control, private services inside the cluster, and least-privilege access for automation.

High-level architecture

The frontend is exposed publicly through a Kubernetes LoadBalancer service. It communicates with the backend via an internal ClusterIP service, which in turn talks to MongoDB and Redis running inside the cluster. Images are published to Docker Hub (lordvetonn/expensy-frontend:v1, lordvetonn/expensy-backend:v1). The AKS cluster is tony-expensy in resource group tony-expensy-aks. At the time of writing, the frontend is reachable at http://20.251.238.124/home.

Key runtime conventions:

Frontend calls the API through NEXT_PUBLIC_API_URL, set to the internal service URL http://expensy-backend:3001/api.

Backend receives DATABASE_URI, REDIS_HOST, and REDIS_PASSWORD as environment variables. Real secrets are provided by the pipeline/runtime, not committed.

Repository layout

The repository is organized to reflect responsibilities and to keep operational assets versioned:

expensy_frontend/ – Next.js application (client UI).

expensy_backend/ – Node/Express API server.

k8s/k8s/ – Kubernetes manifests for frontend, backend, and data services
(e.g., frontend-deployment.yaml, backend-deployment.yaml, db.yaml).

.github/workflows/ci-cd.yml – GitHub Actions workflow for build, image publish, and deploy.

monitoring/ – Place for exported Grafana dashboards and (optional) Prometheus rule/config files.

This structure allows the same repo to drive both development and platform automation end-to-end.

CI/CD pipeline (GitHub Actions)

A single workflow orchestrates the delivery:

Build – Installs dependencies and builds both the frontend and backend.

(Optional) Test – Placeholder for unit/integration tests if/when added.

Containerize & Publish – Builds Docker images and pushes them to Docker Hub.

Deploy to AKS – Authenticates to Azure/AKS and applies the Kubernetes manifests.

The pipeline relies on GitHub Secrets for credentials (Docker Hub, Azure) and any application secrets you choose to inject at deploy time. Nothing sensitive is stored in Git history.

Kubernetes on AKS

The application runs in the default namespace. The frontend is published via a LoadBalancer service, while the backend, MongoDB, and Redis are ClusterIP services restricted to internal traffic. Readiness and liveness probes on the backend ensure Kubernetes only routes traffic to healthy pods and restarts them if the process stops responding.

This split—public frontend, private backend/data—keeps the surface area small and mirrors real-world production patterns.

Monitoring and logging

Two complementary approaches are in place:

Prometheus & Grafana in-cluster: Installed via the kube-prometheus-stack chart to collect Kubernetes metrics automatically and visualize them in Grafana. A custom dashboard (“Expensy – Cluster Health”) shows pod-level CPU, memory, and CPU rate time series for the frontend, backend, Mongo, and Redis. Exported dashboard JSON should be committed under monitoring/dashboards/ for reproducibility.

Azure Monitor / Log Analytics: The AKS monitoring addon is enabled, wiring cluster logs and platform metrics to Azure. From the Azure Portal you can see node/pod CPU and memory, browse container logs, and query them with Kusto. This gives you a second, centralized view that doesn’t depend on the in-cluster stack.

Together, these provide both “inside the cluster” visibility (Grafana) and cloud-native fleet observability (Azure Monitor).

Security and compliance (practical baseline)

Secret handling: No clear-text secrets in the repo. Use GitHub Secrets and/or Kubernetes Secrets to pass DATABASE_URI, REDIS_PASSWORD, etc.

Least privilege: CI uses Azure credentials limited to the actions required (authenticate to AKS and apply manifests).

Network exposure: Only the frontend is internet-facing. The API and data services are private (ClusterIP).

Transport security: For a production extension, add an Ingress + cert-manager to terminate TLS and enable HTTPS end-to-end.

Data/retention: For coursework the data services run inside the cluster; in production, prefer managed services or persistent volumes with encryption at rest. Azure Monitor workspace retention settings govern log/metric retention centrally.

A brief SECURITY.md in the repo can summarize the above for reviewers.

What to commit for reviewers

CI/CD – .github/workflows/ci-cd.yml with build, publish, and deploy stages; short notes in this README on required secrets.

Containerization – Dockerfiles for both frontend and backend.

Kubernetes – Manifests in k8s/k8s/ for Deployments and Services (frontend LoadBalancer; backend/data ClusterIP).

Monitoring/Logging – Exported Grafana dashboards in monitoring/dashboards/ and this README’s explanation of Prometheus/Grafana and Azure Monitor.

Security – A concise SECURITY.md describing secret management, role scoping, network exposure, TLS approach, and retention.

Running locally (optional note)

The project also supports local development using Docker (or Docker Compose) with environment variables mirroring the cluster values. This allows quick iteration without changing the production path.

Status

The current deployment targets AKS cluster tony-expensy (resource group tony-expensy-aks). The frontend is reachable at http://20.251.238.124/home and communicates with the backend via the internal service name. Grafana dashboards are set up in-cluster; Azure Monitor is enabled for platform logs and metrics
