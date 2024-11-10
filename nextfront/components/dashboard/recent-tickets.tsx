"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { getRecentTickets } from "@/lib/api";

interface Ticket {
  ticket_id: number;
  ticket_title: string;
  raised_date: string;
  priority: number;
  state: string;
}

export function RecentTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    getRecentTickets()
      .then(setTickets)
      .catch((error) => console.error("Failed to fetch recent tickets:", error));
  }, []);

  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-4">
        {tickets.map((ticket) => (
          <div
            key={ticket.ticket_id}
            className="flex items-center justify-between space-x-4 rounded-lg border p-4"
          >
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none text-[#3E5660]">
                {ticket.ticket_title}
              </p>
              <p className="text-sm text-[#6D838F]">
                {new Date(ticket.raised_date).toLocaleDateString()}
              </p>
            </div>
            <Badge
              className={cn(
                "capitalize",
                ticket.state === "open" && "bg-[#D5121E]",
                ticket.state === "in_progress" && "bg-[#A15885]",
                ticket.state === "resolved" && "bg-[#4d9d88]",
                ticket.state === "rejected" && "bg-[#6D838F]"
              )}
            >
              {ticket.state.replace("_", " ")}
            </Badge>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}