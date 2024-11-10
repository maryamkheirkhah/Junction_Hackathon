"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getTickets } from "@/lib/api";
import Link from "next/link";

interface Ticket {
  ticket_id: number;
  ticket_title: string;
  raised_date: string;
  priority: number;
  state: string;
}

interface TicketListProps {
  userOnly?: boolean;
}

export function TicketList({ userOnly = false }: TicketListProps) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const fetchFunction = userOnly ? 
      () => getTickets(page, limit, user.user_id) : 
      () => getTickets(page, limit);

    fetchFunction()
      .then(data => {
        if (Array.isArray(data)) {
          setTickets(data);
          setTotalPages(Math.ceil(data.length / limit));
        } else {
          setTickets(data.tickets || []);
          setTotalPages(Math.ceil((data.total || 0) / limit));
        }
      })
      .catch((error) => console.error("Failed to fetch tickets:", error));
  }, [page, userOnly]);

  if (userOnly && tickets.length === 0) {
    return (
      <div className="text-center py-8 text-[#6D838F]">
        <p className="mb-2">No tickets found</p>
        <p className="text-sm">Create new tickets or subscribe to existing ones to see them here</p>
      </div>
    );
  }

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 1:
        return <Badge className="bg-[#D5121E]">High</Badge>;
      case 2:
        return <Badge className="bg-[#A15885]">Medium</Badge>;
      case 3:
        return <Badge className="bg-[#6D838F]">Low</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getStateStyle = (state: string) => {
    return cn(
      "capitalize",
      state === "open" && "bg-[#D5121E]",
      state === "in_progress" && "bg-[#A15885]",
      state === "resolved" && "bg-[#4d9d88]",
      state === "rejected" && "bg-[#6D838F]"
    );
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket.ticket_id} className="cursor-pointer hover:bg-gray-50">
                <TableCell className="font-medium">
                  #{ticket.ticket_id}
                </TableCell>
                <TableCell>
                  <Link 
                    href={`/tickets/${ticket.ticket_id}`}
                    className="text-[#3E5660] hover:text-[#D5121E] transition-colors"
                  >
                    {ticket.ticket_title}
                  </Link>
                </TableCell>
                <TableCell>
                  {new Date(ticket.raised_date).toLocaleDateString()}
                </TableCell>
                <TableCell>{getPriorityLabel(ticket.priority)}</TableCell>
                <TableCell>
                  <Badge className={getStateStyle(ticket.state)}>
                    {ticket.state.replace("_", " ")}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => p + 1)}
          disabled={page === totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
