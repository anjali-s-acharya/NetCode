export function CliOutputPanel({
  cliOutputs,
}: {
  cliOutputs: { device: string; command: string; output: string }[];
}) {
  return (
    <section className="panel">
      <h2>CLI Output</h2>
      {cliOutputs.map((entry, i) => (
        <div key={i} className="cli-block">
          <p className="cli-command">
            <strong>{entry.device}</strong> <code>$ {entry.command}</code>
          </p>
          <pre>{entry.output}</pre>
        </div>
      ))}
    </section>
  );
}
