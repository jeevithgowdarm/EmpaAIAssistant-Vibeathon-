import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertLifestyleQuestionnaireSchema, insertTranscriptSchema } from "@shared/schema";
import { generateWellnessRecommendations } from "./openai";
import { translateText } from "./translate";
import { analyzeFacialExpression } from "./facial-expression";
import { sendVerificationEmail, sendPasswordResetEmail } from "./email";
import session from "express-session";
import crypto from "crypto";
import { z } from "zod";

declare module 'express-session' {
  interface SessionData {
    userId?: string;
  }
}

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function requireAuth(req: Request, res: Response, next: Function) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  const user = await storage.getUser(req.session.userId);
  if (!user || !user.emailVerified) {
    req.session.destroy(() => {});
    return res.status(403).json({ error: "Email verification required" });
  }
  
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "empaai-secret-key-change-in-production",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      },
    })
  );

  app.post("/api/auth/signup", async (req: Request, res: Response) => {
    try {
      const validationResult = insertUserSchema.extend({
        userType: insertUserSchema.shape.userType,
      }).safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Validation failed",
          details: validationResult.error.errors 
        });
      }

      const { email, password, userType } = validationResult.data;

      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "Email already in use" });
      }

      const hashedPassword = hashPassword(password);
      const user = await storage.createUser({
        email,
        password: hashedPassword,
        userType,
      });

      const verificationToken = crypto.randomBytes(32).toString('hex');
      const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
      
      await storage.setEmailVerificationToken(user.id, verificationToken, verificationExpiry);
      await sendVerificationEmail(user.email, verificationToken);

      res.json({ 
        message: "Account created successfully! Please check your email and verify your account before logging in.",
        email: user.email
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ error: "Failed to create account" });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const loginSchema = insertUserSchema.pick({ email: true, password: true });
      const validationResult = loginSchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Validation failed",
          details: validationResult.error.errors 
        });
      }

      const { email, password } = validationResult.data;

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const hashedPassword = hashPassword(password);
      if (user.password !== hashedPassword) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      if (!user.emailVerified) {
        return res.status(403).json({ 
          error: "Email not verified. Please check your email and verify your account before logging in.",
          emailNotVerified: true,
          email: user.email
        });
      }

      req.session.userId = user.id;

      const { password: _, ...userWithoutPassword } = user;
      res.json({ 
        user: userWithoutPassword,
        message: "Login successful"
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Failed to login" });
    }
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to logout" });
      }
      res.json({ message: "Logout successful" });
    });
  });

  app.post("/api/auth/verify-email", async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      
      if (!token) {
        return res.status(400).json({ error: "Verification token is required" });
      }

      const user = await storage.getUserByVerificationToken(token);
      if (!user) {
        return res.status(400).json({ error: "Invalid or expired verification token" });
      }

      if (user.emailVerified) {
        return res.status(400).json({ error: "Email already verified" });
      }

      if (user.emailVerificationExpiry && new Date(user.emailVerificationExpiry) < new Date()) {
        return res.status(400).json({ error: "Verification token has expired" });
      }

      await storage.verifyUserEmail(user.id);

      res.json({ message: "Email verified successfully" });
    } catch (error) {
      console.error("Email verification error:", error);
      res.status(500).json({ error: "Failed to verify email" });
    }
  });

  app.post("/api/auth/resend-verification", async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      const user = await storage.getUserByEmail(email);
      if (user && !user.emailVerified) {
        const token = crypto.randomBytes(32).toString('hex');
        const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

        await storage.setEmailVerificationToken(user.id, token, expiry);
        await sendVerificationEmail(user.email, token);
      }

      res.json({ message: "If an unverified account exists with that email, a verification link has been sent" });
    } catch (error) {
      console.error("Resend verification error:", error);
      res.status(500).json({ error: "Failed to send verification email" });
    }
  });

  app.post("/api/auth/request-password-reset", async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.json({ message: "If an account with that email exists, a password reset link has been sent" });
      }

      const token = crypto.randomBytes(32).toString('hex');
      const expiry = new Date(Date.now() + 60 * 60 * 1000);

      await storage.setPasswordResetToken(user.id, token, expiry);
      await sendPasswordResetEmail(user.email, token);

      res.json({ message: "If an account with that email exists, a password reset link has been sent" });
    } catch (error) {
      console.error("Password reset request error:", error);
      res.status(500).json({ error: "Failed to process password reset request" });
    }
  });

  app.post("/api/auth/reset-password", async (req: Request, res: Response) => {
    try {
      const { token, newPassword } = req.body;
      
      if (!token || !newPassword) {
        return res.status(400).json({ error: "Token and new password are required" });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
      }

      const user = await storage.getUserByPasswordResetToken(token);
      if (!user) {
        return res.status(400).json({ error: "Invalid or expired reset token" });
      }

      if (user.passwordResetExpiry && new Date(user.passwordResetExpiry) < new Date()) {
        return res.status(400).json({ error: "Reset token has expired" });
      }

      const hashedPassword = hashPassword(newPassword);
      await storage.resetUserPassword(user.id, hashedPassword);

      res.json({ message: "Password reset successfully" });
    } catch (error) {
      console.error("Password reset error:", error);
      res.status(500).json({ error: "Failed to reset password" });
    }
  });

  app.get("/api/users/me", requireAuth, async (req: Request, res: Response) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ error: "Failed to get user" });
    }
  });

  app.patch("/api/users/profile", requireAuth, async (req: Request, res: Response) => {
    try {
      const validationResult = insertUserSchema.partial().safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Validation failed",
          details: validationResult.error.errors 
        });
      }

      const { email } = validationResult.data;
      
      if (email) {
        const existingUser = await storage.getUserByEmail(email);
        if (existingUser && existingUser.id !== req.session.userId) {
          return res.status(400).json({ error: "Email already in use" });
        }
      }

      const updatedUser = await storage.updateUser(req.session.userId!, validationResult.data);
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const { password: _, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  app.post("/api/lifestyle/submit", requireAuth, async (req: Request, res: Response) => {
    try {
      const validationResult = insertLifestyleQuestionnaireSchema.pick({
        responses: true,
      }).safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Validation failed",
          details: validationResult.error.errors 
        });
      }

      const { responses } = validationResult.data;

      const questionnaire = await storage.createLifestyleQuestionnaire({
        userId: req.session.userId!,
        responses,
      });

      const recommendations = await generateWellnessRecommendations(responses as any);

      const wellnessRecommendation = await storage.createWellnessRecommendation({
        userId: req.session.userId!,
        questionnaireId: questionnaire.id,
        recommendations,
      });

      res.json({
        questionnaire,
        recommendations: wellnessRecommendation.recommendations,
        message: "Recommendations generated successfully"
      });
    } catch (error) {
      console.error("Lifestyle submission error:", error);
      res.status(500).json({ error: "Failed to process questionnaire" });
    }
  });

  app.post("/api/videos/upload", requireAuth, async (req: Request, res: Response) => {
    try {
      const validationResult = z.object({
        videoUrl: z.string().optional(),
        videoData: z.string().optional(),
        fileName: z.string().optional(),
        fileType: z.string().optional(),
      }).safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Validation failed",
          details: validationResult.error.errors 
        });
      }

      const { videoUrl, videoData } = validationResult.data;
      
      const finalVideoUrl = videoData || videoUrl || `video-${Date.now()}.webm`;

      const session = await storage.createVideoSession({
        userId: req.session.userId!,
        videoUrl: finalVideoUrl,
        signLanguageResults: null,
        facialExpressionResults: null,
        translationResults: null,
      });

      res.json({
        session,
        message: "Video session created"
      });
    } catch (error) {
      console.error("Video upload error:", error);
      res.status(500).json({ error: "Failed to upload video" });
    }
  });

  app.post("/api/videos/process", requireAuth, async (req: Request, res: Response) => {
    try {
      const validationResult = z.object({
        sessionId: z.string(),
      }).safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Validation failed",
          details: validationResult.error.errors 
        });
      }

      const { sessionId } = validationResult.data;

      const session = await storage.getVideoSession(sessionId);
      if (!session) {
        return res.status(404).json({ error: "Video session not found" });
      }

      if (session.userId !== req.session.userId) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      const mockSignLanguageResults = [
        { gesture: "Hello", emoji: "👋", confidence: 0.92 },
        { gesture: "Thank you", emoji: "🙏", confidence: 0.88 },
        { gesture: "I love you", emoji: "❤️", confidence: 0.95 },
        { gesture: "Peace", emoji: "✌️", confidence: 0.90 },
        { gesture: "OK", emoji: "👌", confidence: 0.87 },
        { gesture: "Thumbs up", emoji: "👍", confidence: 0.91 },
      ];

      const facialExpression = await analyzeFacialExpression(session.videoUrl || "");
      const translations = await translateText("Hello, how are you today?");

      res.json({
        signLanguageResults: mockSignLanguageResults,
        facialExpressionResults: facialExpression,
        translationResults: translations,
        message: "Video processed successfully"
      });
    } catch (error) {
      console.error("Video processing error:", error);
      res.status(500).json({ error: "Failed to process video" });
    }
  });

  app.post("/api/transcripts/generate", requireAuth, async (req: Request, res: Response) => {
    try {
      const validationResult = insertTranscriptSchema.pick({
        videoSessionId: true,
        content: true,
      }).safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Validation failed",
          details: validationResult.error.errors 
        });
      }

      const { videoSessionId, content } = validationResult.data;

      const transcript = await storage.createTranscript({
        userId: req.session.userId!,
        videoSessionId,
        content,
      });

      res.json({
        transcript,
        message: "Transcript created successfully"
      });
    } catch (error) {
      console.error("Transcript generation error:", error);
      res.status(500).json({ error: "Failed to generate transcript" });
    }
  });

  app.get("/api/transcripts/:id/download", requireAuth, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const transcript = await storage.getTranscript(id);
      if (!transcript) {
        return res.status(404).json({ error: "Transcript not found" });
      }

      if (transcript.userId !== req.session.userId) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Disposition', `attachment; filename="transcript-${id}.txt"`);
      res.send(transcript.content);
    } catch (error) {
      console.error("Transcript download error:", error);
      res.status(500).json({ error: "Failed to download transcript" });
    }
  });

  app.get("/api/lifestyle/history", requireAuth, async (req: Request, res: Response) => {
    try {
      const questionnaires = await storage.getLifestyleQuestionnairesByUserId(req.session.userId!);
      res.json(questionnaires);
    } catch (error) {
      console.error("Lifestyle history error:", error);
      res.status(500).json({ error: "Failed to fetch lifestyle history" });
    }
  });

  app.get("/api/wellness/history", requireAuth, async (req: Request, res: Response) => {
    try {
      const recommendations = await storage.getWellnessRecommendationsByUserId(req.session.userId!);
      res.json(recommendations);
    } catch (error) {
      console.error("Wellness history error:", error);
      res.status(500).json({ error: "Failed to fetch wellness history" });
    }
  });

  app.get("/api/videos/history", requireAuth, async (req: Request, res: Response) => {
    try {
      const sessions = await storage.getVideoSessionsByUserId(req.session.userId!);
      res.json(sessions);
    } catch (error) {
      console.error("Video history error:", error);
      res.status(500).json({ error: "Failed to fetch video history" });
    }
  });

  app.get("/api/transcripts/history", requireAuth, async (req: Request, res: Response) => {
    try {
      const transcripts = await storage.getTranscriptsByUserId(req.session.userId!);
      res.json(transcripts);
    } catch (error) {
      console.error("Transcript history error:", error);
      res.status(500).json({ error: "Failed to fetch transcript history" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
