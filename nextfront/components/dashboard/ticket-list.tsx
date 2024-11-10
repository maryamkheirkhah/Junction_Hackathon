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

interface Ticket {
  ticket_id: number;
  ticket_title: string;
  raised_date: string;
  priority: number;
  state: string;
}

export function TicketList() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    getTickets(page, limit)
      .then(setTickets)
      .catch((error) => console.error("Failed to fetch tickets:", error));
  }, [page]);

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
              <TableRow key={ticket.ticket_id}>
                <TableCell className="font-medium">
                  #{ticket.ticket_id}
                </TableCell>
                <TableCell>{ticket.ticket_title}</TableCell>
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
