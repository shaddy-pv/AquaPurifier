import { useState, useEffect, useCallback } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  CheckCircle, 
  XCircle, 
  Clock, 
  RefreshCw,
  MessageSquareQuote
} from "lucide-react";
import { adminApi, AdminReview } from "@/lib/api";
import { toast } from "sonner";

export default function Reviews() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.reviews.getAll(filter !== "all" ? { status: filter } : undefined);
      setReviews(data.reviews || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load reviews";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      await adminApi.reviews.approve(id);
      toast.success("Review approved and published to store!");
      setReviews((prev) => 
        prev.map((r) => ((r.id === id || r._id === id) ? { ...r, status: "approved" } : r))
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to approve";
      toast.error(msg);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    setProcessingId(id);
    try {
      await adminApi.reviews.reject(id);
      toast.info("Review rejected");
      setReviews((prev) => 
        prev.map((r) => ((r.id === id || r._id === id) ? { ...r, status: "rejected" } : r))
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to reject";
      toast.error(msg);
    } finally {
      setProcessingId(null);
    }
  };

  const pendingCount = reviews.filter((r) => r.status === "pending").length;
  const approvedCount = reviews.filter((r) => r.status === "approved").length;

  return (
    <AdminLayout
      title="Product Testimonials & Reviews"
      description="Moderate customer reviews, publish testimonials, and protect store credibility"
    >
      <div className="space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border border-sky-100 bg-white shadow-soft">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">Submitted Reviews</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{reviews.length}</h3>
              </div>
              <div className="h-11 w-11 rounded-2xl bg-sky-50 border border-sky-100 text-primary flex items-center justify-center">
                <MessageSquareQuote className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-sky-100 bg-white shadow-soft">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">Pending Review</p>
                <h3 className="text-2xl font-bold text-amber-600 mt-1">{pendingCount}</h3>
              </div>
              <div className="h-11 w-11 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center">
                <Clock className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-sky-100 bg-white shadow-soft">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">Approved Live</p>
                <h3 className="text-2xl font-bold text-emerald-600 mt-1">{approvedCount}</h3>
              </div>
              <div className="h-11 w-11 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Bar */}
        <Card className="border border-sky-100 bg-white">
          <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-base text-slate-900 font-bold">Feedback Queue</CardTitle>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {(["all", "pending", "approved", "rejected"] as const).map((s) => (
                <Button
                  key={s}
                  variant={filter === s ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(s)}
                  className={`text-xs capitalize ${
                    filter === s 
                      ? "bg-gradient-primary text-white" 
                      : "border-sky-100 text-slate-600 hover:text-primary hover:bg-sky-50"
                  }`}
                >
                  {s}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={fetchReviews}
                disabled={loading}
                className="border-sky-100 text-slate-600 hover:text-primary ml-2"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4">
            {reviews.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm">
                No reviews found under this filter.
              </div>
            ) : (
              reviews.map((rev) => {
                const revId = rev.id || rev._id || "temp";
                return (
                  <div 
                    key={revId}
                    className="p-4 sm:p-5 rounded-2xl border border-sky-100 bg-sky-50/20 hover:bg-sky-50/50 transition-colors flex flex-col sm:flex-row gap-4 justify-between items-start"
                  >
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{rev.product.name}</span>
                        <div className="flex items-center text-amber-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-3.5 w-3.5 ${i < rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} 
                            />
                          ))}
                        </div>
                        <Badge 
                          variant="outline"
                          className={
                            rev.status === "approved"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 text-xs"
                              : rev.status === "pending"
                              ? "bg-amber-50 text-amber-700 border-amber-200 text-xs"
                              : "bg-red-50 text-red-700 border-red-200 text-xs"
                          }
                        >
                          {rev.status}
                        </Badge>
                      </div>

                      <h4 className="font-semibold text-slate-800 text-sm">{rev.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>

                      <div className="text-xs text-slate-400 pt-1">
                        Author: <span className="text-slate-700 font-medium">{rev.user.name}</span>
                        {rev.user.email && ` (${rev.user.email})`}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      {rev.status !== "approved" && (
                        <Button
                          size="sm"
                          disabled={processingId === revId}
                          onClick={() => handleApprove(revId)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8"
                        >
                          <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                          Approve
                        </Button>
                      )}
                      {rev.status !== "rejected" && (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={processingId === revId}
                          onClick={() => handleReject(revId)}
                          className="border-sky-100 text-slate-600 hover:text-red-600 hover:bg-red-50 text-xs h-8"
                        >
                          <XCircle className="h-3.5 w-3.5 mr-1.5" />
                          Reject
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
