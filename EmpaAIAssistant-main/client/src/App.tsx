import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { SkipToContent } from "@/components/skip-to-content";
import { checkSession, setStoredUser } from "@/lib/auth";
import { useEffect } from "react";

import Landing from "@/pages/landing";
import Signup from "@/pages/auth/signup";
import Login from "@/pages/auth/login";
import DisabledDashboard from "@/pages/dashboard/disabled";
import NonDisabledDashboard from "@/pages/dashboard/non-disabled";
import Profile from "@/pages/profile";
import History from "@/pages/history";
import Help from "@/pages/help";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ component: Component, ...rest }: any) {
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/users/me"],
    queryFn: checkSession,
    retry: false,
  });

  useEffect(() => {
    if (user) {
      setStoredUser(user);
    }
  }, [user]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/auth/login" />;
  }

  return <Component {...rest} />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/auth/signup" component={Signup} />
      <Route path="/auth/login" component={Login} />
      <Route path="/dashboard/disabled">
        {() => <ProtectedRoute component={DisabledDashboard} />}
      </Route>
      <Route path="/dashboard/non-disabled">
        {() => <ProtectedRoute component={NonDisabledDashboard} />}
      </Route>
      <Route path="/profile">
        {() => <ProtectedRoute component={Profile} />}
      </Route>
      <Route path="/history">
        {() => <ProtectedRoute component={History} />}
      </Route>
      <Route path="/help" component={Help} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <SkipToContent />
          <div className="min-h-screen flex flex-col">
            <Header />
            <main id="main-content" className="flex-1" tabIndex={-1}>
              <Router />
            </main>
          </div>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
