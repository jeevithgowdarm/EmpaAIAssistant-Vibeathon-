import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { getStoredUser } from "@/lib/auth";
import { User, Mail, Shield } from "lucide-react";

export default function Profile() {
  const user = getStoredUser();
  const [email, setEmail] = useState(user?.email || "");

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-2">Profile Settings</h1>
      <p className="text-muted-foreground mb-8 text-lg">
        Manage your account information and preferences
      </p>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account Information
            </CardTitle>
            <CardDescription>Your basic account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base">Email Address</Label>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled
                  data-testid="input-email"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-base">Account Type</Label>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <Badge variant="secondary" className="text-base px-4 py-2" data-testid="badge-user-type">
                  {user.userType === "disabled" ? "Disabled User" : "Non-Disabled User"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {user.userType === "disabled" 
                  ? "You have access to accessibility tools including sign language detection, facial expression analysis, and multilingual translation."
                  : "You have access to wellness features including lifestyle questionnaire, mood analysis, and personalized recommendations."
                }
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Privacy & Data</CardTitle>
            <CardDescription>Control how your data is used</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start justify-between p-4 rounded-lg border">
              <div className="flex-1">
                <h4 className="font-semibold mb-1">Camera & Microphone Access</h4>
                <p className="text-sm text-muted-foreground">
                  Required for video recording, webcam mood analysis, and speech-to-text features
                </p>
              </div>
              <Badge variant="outline">Managed by Browser</Badge>
            </div>

            <div className="flex items-start justify-between p-4 rounded-lg border">
              <div className="flex-1">
                <h4 className="font-semibold mb-1">AI Processing</h4>
                <p className="text-sm text-muted-foreground">
                  Your data is processed to provide personalized recommendations and accessibility features
                </p>
              </div>
              <Badge variant="secondary">Active</Badge>
            </div>

            <div className="flex items-start justify-between p-4 rounded-lg border">
              <div className="flex-1">
                <h4 className="font-semibold mb-1">Data Storage</h4>
                <p className="text-sm text-muted-foreground">
                  Session data is stored temporarily and cleared when you log out
                </p>
              </div>
              <Badge variant="outline">In-Memory</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>Irreversible account actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start justify-between p-4 rounded-lg border border-destructive/50 bg-destructive/5">
              <div className="flex-1">
                <h4 className="font-semibold mb-1">Delete Account</h4>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
              </div>
              <Button variant="destructive" disabled data-testid="button-delete-account">
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
