export function LessonContentPanel({
  content,
}: {
  content: { explanation: string; example: string };
}) {
  return (
    <section className="panel">
      <h2>Learn</h2>
      <p>{content.explanation}</p>
      {content.example && <pre>{content.example}</pre>}
    </section>
  );
}
