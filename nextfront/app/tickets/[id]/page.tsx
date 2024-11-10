import { TicketDetail } from './ticket-detail';

export async function generateStaticParams() {
  const tickets = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tickets`)
    .then(res => res.json())
    .catch(() => []);

  return tickets.map((ticket: { ticket_id: number }) => ({
    id: ticket.ticket_id.toString(),
  }));
}

export default async function TicketPage({ params }: { params: { id: string } }) {
  const ticket = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tickets/${params.id}`)
    .then(res => res.json())
    .catch(err => null);

  if (!ticket) {
    return <div>Ticket not found</div>;
  }

  return <TicketDetail initialTicket={ticket} />;
}
