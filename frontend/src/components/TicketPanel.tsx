export function TicketPanel({
  ticket,
}: {
  ticket: { summary: string; reportedBy: string; priority: string };
}) {
  return (
    <section className="panel">
      <h2>Trouble Ticket</h2>
      <p className="ticket-meta">
        Reported by <strong>{ticket.reportedBy}</strong> · Priority{" "}
        <span className={`priority priority-${ticket.priority.toLowerCase()}`}>
          {ticket.priority}
        </span>
      </p>
      <p>{ticket.summary}</p>
    </section>
  );
}
