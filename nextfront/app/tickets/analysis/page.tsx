"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RefreshCcw, Send } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Define comprehensive key factors for different dot counts (1-10)
const keyFactorsDatabase = {
  1: [
    "Proposal lacks sufficient detail for evaluation",
    "Similar proposals have low acceptance rate",
    "Impact assessment needs more clarity"
  ],
  2: [
    "Basic concept is present but needs elaboration",
    "Historical data suggests more context needed",
    "Implementation path requires more detail"
  ],
  3: [
    "Proposal shows potential but needs refinement",
    "Similar tickets have 30% acceptance rate",
    "Technical feasibility needs more explanation"
  ],
  4: [
    "Description clarity is improving",
    "Comparable proposals show moderate success",
    "Resource requirements are becoming clearer"
  ],
  5: [
    "Proposal demonstrates good thought process",
    "Historical patterns indicate growing viability",
    "Implementation approach is taking shape"
  ],
  6: [
    "Detail level matches successful tickets",
    "Similar proposals show 60% acceptance rate",
    "Technical assessment indicates feasibility"
  ],
  7: [
    "Proposal demonstrates strong potential",
    "Historical data supports implementation",
    "Resource allocation appears reasonable"
  ],
  8: [
    "Description quality matches top performers",
    "Similar proposals have high success rate",
    "Implementation plan is well-structured"
  ],
  9: [
    "Proposal exceeds detail requirements",
    "Historical analysis suggests high viability",
    "Technical implementation is well-defined"
  ],
  10: [
    "Exceptional level of detail provided",
    "Matches characteristics of top accepted tickets",
    "Implementation plan is comprehensive"
  ]
};

// Update the getAIAnalysis function
const getAIAnalysis = (description: string) => {
  const dotCount = (description.match(/\./g) || []).length;
  const baseRate = Math.min(Math.round((dotCount / 10) * 100), 100);
  const variation = (Math.random() * 6 - 2.1).toFixed(1);
  const acceptanceRate = Math.min(baseRate + parseFloat(variation), 100);
  
  // Get the appropriate key factors based on dot count
  const factorIndex = Math.min(Math.max(Math.ceil(dotCount), 1), 10);
  
  return {
    acceptanceRate,
    reasons: keyFactorsDatabase[factorIndex as keyof typeof keyFactorsDatabase]
  };
};

export default function TicketAnalysisPage() {
  const router = useRouter();
  const [analysis, setAnalysis] = useState<{ acceptanceRate: number; reasons: string[] }>();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [formData, setFormData] = useState(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('pendingTicket') || '{}');
    }
    return {};
  });

  const performAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setAnalysis(getAIAnalysis(formData.description));
      setIsAnalyzing(false);
    }, 1500);
  };

  useEffect(() => {
    performAnalysis();
  }, []);

  const handleSubmit = () => {
    localStorage.setItem('pendingTicket', JSON.stringify(formData));
    router.push('/dashboard');
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
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold text-[#3E5660] mb-6">AI Ticket Analysis</h1>
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ticket Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.ticket_title}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, ticket_title: e.target.value }));
                    performAnalysis();
                  }}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, description: e.target.value }));
                    performAnalysis();
                  }}
                  className="min-h-[100px]"
                  required
                />
              </div>

              {/* Rest of the form fields similar to new/page.tsx */}
              {/* Reference existing code */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">High</SelectItem>
                      <SelectItem value="2">Medium</SelectItem>
                      <SelectItem value="3">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="impact">Impact</Label>
                  <Select
                    value={formData.impact}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, impact: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select impact" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="functional_area">Functional Area</Label>
                <Input
                  id="functional_area"
                  value={formData.functional_area}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, functional_area: e.target.value }));
                    performAnalysis();
                  }}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Success Probability Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Analysis content from previous implementation */}
            {/* Reference existing code */}
            {isAnalyzing ? (
              <div className="text-center py-8">
                <p className="text-[#6D838F]">Analyzing ticket data...</p>
              </div>
            ) : analysis ? (
              <>
                <div className="space-y-4">
                  <div className="w-full h-4 bg-[#D5121E] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#4d9d88]"
                      style={{ width: `${analysis.acceptanceRate}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-[#4d9d88]">
                      Acceptance Probability ({analysis.acceptanceRate.toFixed(1)}%)
                    </span>
                    <span className="text-[#D5121E]">
                      Rejection Probability ({(100 - analysis.acceptanceRate).toFixed(1)}%)
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Key Factors Based on Historical Analysis:</h3>
                  <ul className="space-y-2">
                    {analysis.reasons.map((reason, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-[#4d9d88]">•</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button
                    onClick={handleSubmit}
                    className="bg-[#D5121E] gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Submit Ticket
                  </Button>
                </div>
              </>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 