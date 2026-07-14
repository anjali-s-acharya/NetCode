export function LogsPanel({ logs }: { logs: { source: string; content: string }[] }) {
  return (
    <section className="panel">
      <h2>Logs</h2>
      {logs.map((log, i) => (
        <div key={i} className="log-block">
          <p className="log-source">{log.source}</p>
          <pre>{log.content}</pre>
        </div>
      ))}
    </section>
  );
}
