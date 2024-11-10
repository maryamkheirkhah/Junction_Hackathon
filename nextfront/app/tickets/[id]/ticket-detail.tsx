"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { MessageSquare } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Comment {
  comment_id: number;
  comment_text: string;
  user_id: number;
  timestamp: string;
}

interface TicketDetail {
  ticket_id: number;
  ticket_title: string;
  description: string;
  clarification: string;
  state: string;
  priority: number;
  impact: string;
  requires_action: boolean;
  raised_date: string;
  functional_area: string;
  created_by: number;
  product_improvement: boolean;
  planned_release_version: string;
  comments: Comment[];
}

interface TicketDetailProps {
  initialTicket: TicketDetail;
}

export function TicketDetail({ initialTicket }: TicketDetailProps) {
  const params = useParams();
  const [ticket, setTicket] = useState<TicketDetail>(initialTicket);
  const [newComment, setNewComment] = useState("");
  const { toast } = useToast();
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tickets/${params.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment_text: newComment }),
      });
      if (response.ok) {
        const comment = await response.json();
        setTicket(prev => ({
          ...prev,
          comments: [...prev.comments, comment],
        }));
        setNewComment("");
        toast({
          title: "Comment added",
          description: "Your comment has been added successfully.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add comment.",
      });
    }
  };

  const toggleSubscription = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tickets/${params.id}/${isSubscribed ? "unsubscribe" : "subscribe"}`,
        {
          method: isSubscribed ? "DELETE" : "POST",
        }
      );
      if (response.ok) {
        setIsSubscribed(!isSubscribed);
        toast({
          title: isSubscribed ? "Unsubscribed" : "Subscribed",
          description: isSubscribed
            ? "You will no longer receive notifications."
            : "You will now receive notifications.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update subscription.",
      });
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#3E5660]">
          Ticket #{ticket.ticket_id}
        </h1>
        <Button
          onClick={toggleSubscription}
          variant={isSubscribed ? "outline" : "default"}
          className={isSubscribed ? "bg-[#E9EEF2]" : "bg-[#D5121E]"}
        >
          {isSubscribed ? "Unsubscribe" : "Subscribe to Updates"}
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>{ticket.ticket_title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-[#3E5660]">{ticket.description}</p>
            </div>
            {ticket.clarification && (
              <div>
                <h3 className="font-semibold mb-2">Clarification</h3>
                <p className="text-[#3E5660]">{ticket.clarification}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[#6D838F]">Status</span>
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
            <div className="flex justify-between items-center">
              <span className="text-[#6D838F]">Priority</span>
              <Badge
                className={cn(
                  ticket.priority === 1 && "bg-[#D5121E]",
                  ticket.priority === 2 && "bg-[#A15885]",
                  ticket.priority === 3 && "bg-[#6D838F]"
                )}
              >
                {ticket.priority === 1
                  ? "High"
                  : ticket.priority === 2
                  ? "Medium"
                  : "Low"}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#6D838F]">Impact</span>
              <span className="capitalize">{ticket.impact}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#6D838F]">Functional Area</span>
              <span>{ticket.functional_area}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#6D838F]">Raised Date</span>
              <span>{new Date(ticket.raised_date).toLocaleDateString()}</span>
            </div>
            {ticket.planned_release_version && (
              <div className="flex justify-between items-center">
                <span className="text-[#6D838F]">Planned Release</span>
                <span>{ticket.planned_release_version}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Comments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {ticket?.comments && ticket.comments.length > 0 ? (
                ticket.comments.map((comment) => (
                  <div
                    key={comment.comment_id}
                    className="p-4 rounded-lg bg-[#E9EEF2]"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium">User #{comment.user_id}</span>
                      <span className="text-sm text-[#6D838F]">
                        {new Date(comment.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[#3E5660]">{comment.comment_text}</p>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500">
                  No comments yet
                </div>
              )}
            </div>
          </ScrollArea>
          <Separator className="my-4" />
          <form onSubmit={handleAddComment} className="space-y-4">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px]"
            />
            <Button type="submit" className="bg-[#D5121E]">
              Add Comment
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}