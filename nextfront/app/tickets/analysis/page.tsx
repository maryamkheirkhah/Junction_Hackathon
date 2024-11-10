"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Send } from "lucide-react";

// Mock AI analysis function
const getAIAnalysis = () => {
  return {
    acceptanceRate: 75,
    reasons: [
      "Similar tickets have been successfully implemented in the past",
      "The functional area specified has capacity for new features",
      "Priority and impact levels are appropriately set"
    ]
  };
};

export default function TicketAnalysisPage() {
  const router = useRouter();
  const [analysis, setAnalysis] = useState<{ acceptanceRate: number; reasons: string[] }>();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    performAnalysis();
  }, []);

  const performAnalysis = () => {
    setIsAnalyzing(true);
    // Simulate API call delay
    setTimeout(() => {
      setAnalysis(getAIAnalysis());
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleSubmit = () => {
    // Here you would submit the ticket data stored in localStorage
    router.push('/dashboard');
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold text-[#3E5660]">AI Ticket Analysis</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Success Probability Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {isAnalyzing ? (
            <div className="text-center py-8">
              <p className="text-[#6D838F]">Analyzing ticket data...</p>
            </div>
          ) : analysis ? (
            <>
              <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#D5121E] to-[#4d9d88]"
                  style={{ width: `${analysis.acceptanceRate}%` }}
                />
              </div>
              
              <div className="flex justify-between text-sm text-[#6D838F]">
                <span>Rejection Probability</span>
                <span>Acceptance Probability</span>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Key Factors:</h3>
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
                  onClick={performAnalysis}
                  variant="outline"
                  className="gap-2"
                >
                  <RefreshCcw className="h-4 w-4" />
                  Reanalyze
                </Button>
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
  );
} 