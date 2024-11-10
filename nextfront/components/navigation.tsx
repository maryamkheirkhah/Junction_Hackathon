"use client";

import { Bell, LayoutDashboard, LogOut, Settings, Ticket } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export default function Navigation() {
  const pathname = usePathname();
  
  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <div className="font-bold text-xl text-[#D5121E]">Fingrid</div>
          </Link>
          <nav className="flex items-center gap-4">
            <Link 
              href="/dashboard"
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors hover:text-[#3E5660]",
                isActive("/dashboard") ? "text-[#3E5660]" : "text-[#6D838F]"
              )}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link 
              href="/tickets"
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors hover:text-[#3E5660]",
                isActive("/tickets") ? "text-[#3E5660]" : "text-[#6D838F]"
              )}
            >
              <Ticket className="h-4 w-4" />
              Tickets
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5 text-[#6D838F]" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5 text-[#6D838F]" />
          </Button>
          <Button variant="ghost" size="icon">
            <LogOut className="h-5 w-5 text-[#6D838F]" />
          </Button>
        </div>
      </div>
    </header>
  );
}