export function MonitoringPanel({
  monitoring,
}: {
  monitoring: { metric: string; notes: string };
}) {
  return (
    <section className="panel">
      <h2>Monitoring</h2>
      <p className="metric-name">
        Metric: <code>{monitoring.metric}</code>
      </p>
      <p>{monitoring.notes}</p>
    </section>
  );
}
