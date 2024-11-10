import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { useState } from "react";
import { Send } from "lucide-react";

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  // add other relevant ticket fields
}

export function ChatDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const chatResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          user_question: userInput
        }),
      });

      if (!chatResponse.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await chatResponse.json();
      setResponse(data.response);
    } catch (error) {
      setResponse('Sorry, I encountered an error while processing your request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <div className="flex flex-col h-[400px]">
          <div className="flex-1 overflow-y-auto p-4">
            {response && (
              <div className="bg-gray-100 rounded-lg p-3 mb-4">
                {response}
              </div>
            )}
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t">
            <Input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask about your tickets..."
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "..." : "Send"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
} 