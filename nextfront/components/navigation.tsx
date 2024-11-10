"use client";

import { Bell, LayoutDashboard, LogOut, Settings, Ticket } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { ChatDialog } from "./chat-dialog";


export default function Navigation() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const fullText = "Ask Anything...";
  
  useEffect(() => {
    if (isTyping) {
      if (displayText.length < fullText.length) {
        const timeout = setTimeout(() => {
          setDisplayText(fullText.slice(0, displayText.length + 1));
        }, 100); // Adjust speed here (lower number = faster)
        return () => clearTimeout(timeout);
      } else {
        setTimeout(() => {
          setDisplayText("");
          setIsTyping(true);
        }, 3000); // Wait 3 seconds before restarting
      }
    }
  }, [displayText, isTyping]);

  const isActive = (path: string) => pathname === path;

  const handleLogout = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });

      router.push("/login");
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      router.push("/login");
      toast({
        title: "Logged out",
        description: "You have been logged out.",
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto">
        <div className="flex items-center gap-6 w-[240px]">
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
        <div className="flex-1 flex justify-center">
          <Button
            variant="outline"
            className="w-[200px] relative overflow-hidden text-[#6D838F]"
            onClick={() => setIsChatOpen(true)}
          >
            <span className="inline-block min-w-[1ch]">
              {displayText}
              <span className="animate-blink text-[#6D838F]">|</span>
            </span>
          </Button>
        </div>
        <div className="flex items-center gap-4 w-[240px] justify-end">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5 text-[#6D838F]" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5 text-[#6D838F]" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5 text-[#6D838F]" />
          </Button>
        </div>
      </div>
      <ChatDialog open={isChatOpen} onOpenChange={setIsChatOpen} />
    </header>
  );
}