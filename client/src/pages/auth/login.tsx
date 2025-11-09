import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { setStoredUser } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, Heart, Mail } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [emailNotVerified, setEmailNotVerified] = useState<string | null>(null);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const result = await apiRequest("POST", "/api/auth/login", data);
      return result;
    },
    onSuccess: (data) => {
      setStoredUser(data.user);
      toast({
        title: "Welcome back!",
        description: "Login successful",
      });
      const redirectPath = data.user.userType === "disabled" 
        ? "/dashboard/disabled" 
        : "/dashboard/non-disabled";
      setLocation(redirectPath);
    },
    onError: (error: any) => {
      if (error.emailNotVerified) {
        setEmailNotVerified(error.email);
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: error.message,
        });
      }
    },
  });

  const resendVerificationMutation = useMutation({
    mutationFn: async (email: string) => {
      const result = await apiRequest("POST", "/api/auth/resend-verification", { email });
      return result;
    },
    onSuccess: (data) => {
      toast({
        title: "Verification email sent",
        description: data.message,
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Failed to send email",
        description: error.message,
      });
    },
  });

  const onSubmit = (data: LoginForm) => {
    setEmailNotVerified(null);
    loginMutation.mutate(data);
  };

  const handleResendVerification = () => {
    if (emailNotVerified) {
      resendVerificationMutation.mutate(emailNotVerified);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Heart className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl">Welcome Back</CardTitle>
          <CardDescription className="text-base">
            Sign in to your EmpaAI account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          {emailNotVerified && (
            <Alert className="mb-6">
              <Mail className="h-4 w-4" />
              <AlertDescription className="space-y-3">
                <p className="font-semibold">Email verification required</p>
                <p className="text-sm">
                  Please check your email and click the verification link to access your account.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResendVerification}
                  disabled={resendVerificationMutation.isPending}
                  className="w-full"
                >
                  {resendVerificationMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Resend Verification Email
                </Button>
              </AlertDescription>
            </Alert>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="your.email@example.com"
                        data-testid="input-email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <Link href="/forgot-password">
                        <span className="text-sm text-primary hover:underline cursor-pointer">
                          Forgot password?
                        </span>
                      </Link>
                    </div>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        data-testid="input-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={loginMutation.isPending}
                data-testid="button-submit"
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link href="/auth/signup">
              <span className="text-primary font-semibold hover:underline cursor-pointer" data-testid="link-signup">
                Create one
              </span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
