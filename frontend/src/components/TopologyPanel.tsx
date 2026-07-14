interface Node {
  id: string;
  label: string;
  type: string;
}

interface Link {
  from: string;
  to: string;
  label: string;
}

export function TopologyPanel({
  topology,
}: {
  topology: { description: string; nodes: unknown[]; links: unknown[] };
}) {
  const nodes = topology.nodes as Node[];
  const links = topology.links as Link[];
  const labelOf = (id: string) => nodes.find((n) => n.id === id)?.label ?? id;

  return (
    <section className="panel">
      <h2>Topology</h2>
      <p>{topology.description}</p>
      <ul className="topology-links">
        {links.map((link, i) => (
          <li key={i}>
            <code>{labelOf(link.from)}</code> → <code>{labelOf(link.to)}</code>
            <span className="link-label"> ({link.label})</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
