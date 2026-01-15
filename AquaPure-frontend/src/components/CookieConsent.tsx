import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Cookie } from "lucide-react";
import { Link } from "react-router-dom";

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Show banner after 2 seconds
      setTimeout(() => setShowBanner(true), 2000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom">
      <Card className="max-w-4xl mx-auto border-0 shadow-premium bg-card/95 backdrop-blur-md">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Cookie className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">We use cookies</h3>
              <p className="text-sm text-muted-foreground mb-4">
                We use cookies to enhance your browsing experience, serve personalized content, and
                analyze our traffic. By clicking "Accept All", you consent to our use of cookies.{" "}
                <Link to="/privacy-policy" className="text-primary hover:underline">
                  Learn more
                </Link>
              </p>
              
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handleAccept}
                  className="bg-gradient-primary"
                >
                  Accept All
                </Button>
                <Button
                  onClick={handleDecline}
                  variant="outline"
                >
                  Decline
                </Button>
                <Link to="/cookie-policy">
                  <Button variant="ghost" size="sm">
                    Cookie Settings
                  </Button>
                </Link>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleDecline}
              className="flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CookieConsent;
