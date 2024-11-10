"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";
import { ClientDashboard } from "@/components/dashboard/client-dashboard";

export default function DashboardPage() {
  const [userRole, setUserRole] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    // Get user role from localStorage or context
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setUserRole(user.role || "");
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#3E5660]">Dashboard</h1>
        <Button 
          onClick={() => router.push("/tickets/new")} 
          className="bg-[#D5121E]"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          New Ticket
        </Button>
      </div>

      {userRole === "admin" ? (
        <AdminDashboard />
      ) : userRole === "client" ? (
        <ClientDashboard />
      ) : (
        <div className="text-center py-8 text-[#6D838F]">
          <p>Invalid user role. Please contact support.</p>
        </div>
      )}
    </div>
  );
}
