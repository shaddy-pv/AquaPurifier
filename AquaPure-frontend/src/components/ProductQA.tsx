import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, ThumbsUp } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

interface QA {
  id: string;
  question: string;
  answer?: string;
  askedBy: string;
  date: string;
  helpful: number;
}

interface ProductQAProps {
  productId: string;
}

const ProductQA = ({ productId }: ProductQAProps) => {
  const { user, isAuthenticated } = useAuthStore();
  const [showForm, setShowForm] = useState(false);
  const [question, setQuestion] = useState("");
  
  // Mock Q&A data
  const [qaList] = useState<QA[]>([
    {
      id: '1',
      question: 'What is the warranty period for this product?',
      answer: '1 year comprehensive warranty with 3 years on RO membrane.',
      askedBy: 'Amit Singh',
      date: '2024-11-10',
      helpful: 15,
    },
    {
      id: '2',
      question: 'Does it work with low water pressure?',
      answer: 'Yes, it has a built-in booster pump that works with water pressure as low as 0.3 kg/cm².',
      askedBy: 'Neha Patel',
      date: '2024-11-18',
      helpful: 8,
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      toast.error("Please sign in to ask a question");
      return;
    }

    toast.success("Question submitted! We'll answer it soon.");
    setShowForm(false);
    setQuestion("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Questions & Answers</h3>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} variant="outline">
            <MessageCircle className="h-4 w-4 mr-2" />
            Ask a Question
          </Button>
        )}
      </div>

      {/* Question Form */}
      {showForm && (
        <Card className="border-0 shadow-soft bg-card/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="question">Your Question *</Label>
                <Textarea
                  id="question"
                  placeholder="Ask anything about this product..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="min-h-[100px]"
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-gradient-primary">
                  Submit Question
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Q&A List */}
      <div className="space-y-4">
        {qaList.map((qa) => (
          <Card key={qa.id} className="border-0 shadow-soft bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-start gap-3 mb-2">
                    <MessageCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium mb-1">{qa.question}</p>
                      <p className="text-sm text-muted-foreground">
                        Asked by {qa.askedBy} on {qa.date}
                      </p>
                    </div>
                  </div>
                </div>

                {qa.answer && (
                  <div className="pl-8 border-l-2 border-primary/20">
                    <p className="text-muted-foreground mb-2">{qa.answer}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-primary"
                    >
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      Helpful ({qa.helpful})
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {qaList.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No questions yet. Be the first to ask!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductQA;
