import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const token = searchParams.get("token");

  useEffect(() => {
    const verifyEmail = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (token) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <Card className="max-w-md w-full border-0 shadow-premium bg-card/80 backdrop-blur-sm">
        <CardContent className="p-12 text-center">
          {status === "loading" && (
            <>
              <Loader2 className="h-16 w-16 text-primary mx-auto mb-6 animate-spin" />
              <h2 className="text-2xl font-bold mb-4">Verifying Your Email</h2>
              <p className="text-muted-foreground">
                Please wait while we verify your email address...
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-success" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Email Verified!</h2>
              <p className="text-muted-foreground mb-6">
                Your email has been successfully verified. You can now access all features.
              </p>
              <Button
                className="bg-gradient-primary"
                onClick={() => navigate("/")}
              >
                Go to Homepage
              </Button>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="h-10 w-10 text-destructive" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Verification Failed</h2>
              <p className="text-muted-foreground mb-6">
                The verification link is invalid or has expired.
              </p>
              <Button
                variant="outline"
                onClick={() => navigate("/signin")}
              >
                Back to Sign In
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
