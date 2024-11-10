"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TicketList } from "./ticket-list";

export function ClientDashboard() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="border-b">
          <CardTitle>My Tickets</CardTitle>
          <p className="text-sm text-[#6D838F]">
            View and manage tickets you have created or subscribed to
          </p>
        </CardHeader>
        <CardContent className="min-h-[200px]">
          <TicketList userOnly={true} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>All Tickets</CardTitle>
          <p className="text-sm text-[#6D838F]">
            View all tickets in the system
          </p>
        </CardHeader>
        <CardContent className="min-h-[200px]">
          <TicketList />
        </CardContent>
      </Card>
    </div>
  );
} 