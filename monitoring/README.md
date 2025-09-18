# Monitoring & Logging — Expensy

## In-cluster Prometheus & Grafana
Installed via `kube-prometheus-stack` (namespace `monitoring`). Grafana is exposed via a LoadBalancer.

- Grafana: open the external IP from `kps-grafana` Service
- Data source: Prometheus (auto-configured by the chart)
- Dashboard: “Expensy — Cluster Health” (CPU, memory, restarts per pod)
  - Export your JSON to `monitoring/dashboards/cluster-health.json` for reproducibility

Example PromQL used:
- Memory: `sum by(pod) (container_memory_working_set_bytes{namespace="default", image!=""})`
- CPU: `sum by(pod) (rate(container_cpu_usage_seconds_total{namespace="default", image!=""}[5m]))`

## Azure Monitor (Container Insights)
AKS monitoring addon is **enabled**; logs/metrics stream to Log Analytics.

- Azure Portal → Kubernetes service → **Monitor/Insights** for charts
- **Logs** (Kusto):
  - `ContainerLogV2 | where KubernetesNamespace == "default" | take 100`
  - `KubeEvents | where Namespace == "default" | order by TimeGenerated desc`

This gives both real-time (Grafana) and centralized (Azure Monitor) visibility.

Grafana dashboard export: monitoring/dashboards/cluster-health.json
