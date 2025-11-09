import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { setStoredUser } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, Heart } from "lucide-react";
import { Link } from "wouter";

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  userType: z.enum(["disabled", "non-disabled"], {
    required_error: "Please select your user type",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupForm = z.infer<typeof signupSchema>;

export default function Signup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      userType: undefined,
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (data: SignupForm) => {
      const result = await apiRequest("POST", "/api/auth/signup", {
        email: data.email,
        password: data.password,
        userType: data.userType,
      });
      return result;
    },
    onSuccess: (data) => {
      setStoredUser(data.user);
      toast({
        title: "Account created successfully!",
        description: "Welcome to EmpaAI",
      });
      const redirectPath = data.user.userType === "disabled" 
        ? "/dashboard/disabled" 
        : "/dashboard/non-disabled";
      setLocation(redirectPath);
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: error.message,
      });
    },
  });

  const onSubmit = (data: SignupForm) => {
    signupMutation.mutate(data);
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
          <CardTitle className="text-3xl">Create Account</CardTitle>
          <CardDescription className="text-base">
            Join EmpaAI to access personalized accessibility and wellness features
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                    <FormLabel>Password</FormLabel>
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

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        data-testid="input-confirm-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="userType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>I am a...</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="space-y-3"
                      >
                        <div className="flex items-center space-x-3 p-4 rounded-lg border hover-elevate cursor-pointer" data-testid="radio-disabled">
                          <RadioGroupItem value="disabled" id="disabled" />
                          <Label htmlFor="disabled" className="flex-1 cursor-pointer">
                            <div className="font-semibold">Disabled User</div>
                            <div className="text-sm text-muted-foreground">
                              Access sign language detection, speech-to-text, and translation tools
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 p-4 rounded-lg border hover-elevate cursor-pointer" data-testid="radio-non-disabled">
                          <RadioGroupItem value="non-disabled" id="non-disabled" />
                          <Label htmlFor="non-disabled" className="flex-1 cursor-pointer">
                            <div className="font-semibold">Non-Disabled User</div>
                            <div className="text-sm text-muted-foreground">
                              Access wellness questionnaire, mood analysis, and lifestyle insights
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={signupMutation.isPending}
                data-testid="button-submit"
              >
                {signupMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link href="/auth/login">
              <span className="text-primary font-semibold hover:underline cursor-pointer" data-testid="link-login">
                Sign in
              </span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
