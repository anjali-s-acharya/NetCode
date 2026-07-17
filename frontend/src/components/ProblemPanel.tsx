export function ProblemPanel({
  problem,
}: {
  problem: { statement: string; code_context: string; use_case: string };
}) {
  return (
    <section className="panel">
      <h2>Problem</h2>
      <p>{problem.statement}</p>
      {problem.code_context && <pre>{problem.code_context}</pre>}
      <p className="use-case">
        <strong>Real-world use case:</strong> {problem.use_case}
      </p>
    </section>
  );
}
