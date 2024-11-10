"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TicketStatusChart } from "@/components/dashboard/ticket-status-chart";
import { RecentTickets } from "@/components/dashboard/recent-tickets";
import { ResolutionTimeChart } from "@/components/dashboard/resolution-time-chart";
import { AlertCircle, Clock, CheckCircle2, XCircle } from "lucide-react";
import { TicketList } from "@/components/dashboard/ticket-list";

interface TicketStats {
  open: number;
  in_progress: number;
  resolved: number;
  rejected: number;
}

export default function DashboardPage() {
  const [ticketStats, setTicketStats] = useState<TicketStats>({
    open: 0,
    in_progress: 0,
    resolved: 0,
    rejected: 0,
  });

  useEffect(() => {
    // Fetch ticket statistics
    fetch("/analytics/tickets/by-state")
      .then((res) => res.json())
      .then((data) => setTicketStats(data))
      .catch((error) => console.error("Failed to fetch ticket stats:", error));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#3E5660]">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#6D838F]">
              Open Tickets
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-[#D5121E]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#3E5660]">
              {ticketStats.open}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#6D838F]">
              In Progress
            </CardTitle>
            <Clock className="h-4 w-4 text-[#A15885]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#3E5660]">
              {ticketStats.in_progress}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#6D838F]">
              Resolved
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-[#4d9d88]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#3E5660]">
              {ticketStats.resolved}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#6D838F]">
              Rejected
            </CardTitle>
            <XCircle className="h-4 w-4 text-[#6D838F]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#3E5660]">
              {ticketStats.rejected}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-white">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Ticket Status Distribution</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <TicketStatusChart />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Tickets</CardTitle>
              </CardHeader>
              <CardContent>
                <RecentTickets />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resolution Time by Functional Area</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <ResolutionTimeChart />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>All Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <TicketList />
        </CardContent>
      </Card>
    </div>
  );
}
