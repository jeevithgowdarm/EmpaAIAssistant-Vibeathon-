import { useLocation, useSearch } from "wouter";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, Heart, CheckCircle2, XCircle } from "lucide-react";
import { Link } from "wouter";

export default function VerifyEmail() {
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(useSearch());
  const token = searchParams.get("token");
  const [verificationStatus, setVerificationStatus] = useState<"pending" | "success" | "error">("pending");
  const [message, setMessage] = useState("");

  const verifyMutation = useMutation({
    mutationFn: async (verificationToken: string) => {
      const result = await apiRequest("POST", "/api/auth/verify-email", { token: verificationToken });
      return result;
    },
    onSuccess: (data) => {
      setVerificationStatus("success");
      setMessage(data.message || "Email verified successfully!");
    },
    onError: (error: Error) => {
      setVerificationStatus("error");
      setMessage(error.message || "Verification failed");
    },
  });

  useEffect(() => {
    if (token) {
      verifyMutation.mutate(token);
    } else {
      setVerificationStatus("error");
      setMessage("No verification token provided");
    }
  }, [token]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Heart className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl">Email Verification</CardTitle>
          <CardDescription className="text-base">
            Verifying your email address
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {verificationStatus === "pending" && (
            <div className="text-center py-8">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Verifying your email...</p>
            </div>
          )}

          {verificationStatus === "success" && (
            <div className="text-center py-8 space-y-4">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Email Verified!</h3>
                <p className="text-muted-foreground">{message}</p>
              </div>
              <Button onClick={() => setLocation("/auth/login")} className="w-full">
                Continue to Login
              </Button>
            </div>
          )}

          {verificationStatus === "error" && (
            <div className="text-center py-8 space-y-4">
              <XCircle className="h-12 w-12 text-red-500 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Verification Failed</h3>
                <p className="text-muted-foreground">{message}</p>
              </div>
              <div className="space-y-2">
                <Button onClick={() => setLocation("/auth/login")} className="w-full">
                  Back to Login
                </Button>
                <p className="text-sm text-muted-foreground">
                  Need a new verification link?{" "}
                  <Link href="/auth/signup" className="text-primary hover:underline">
                    Sign up again
                  </Link>
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
