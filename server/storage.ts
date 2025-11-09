import { 
  users,
  lifestyleQuestionnaires,
  wellnessRecommendations,
  videoSessions,
  transcripts,
  type User, 
  type InsertUser,
  type LifestyleQuestionnaire,
  type InsertLifestyleQuestionnaire,
  type WellnessRecommendation,
  type InsertWellnessRecommendation,
  type VideoSession,
  type InsertVideoSession,
  type Transcript,
  type InsertTranscript
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  
  createLifestyleQuestionnaire(questionnaire: InsertLifestyleQuestionnaire): Promise<LifestyleQuestionnaire>;
  getLifestyleQuestionnairesByUserId(userId: string): Promise<LifestyleQuestionnaire[]>;
  
  createWellnessRecommendation(recommendation: InsertWellnessRecommendation): Promise<WellnessRecommendation>;
  getWellnessRecommendationsByUserId(userId: string): Promise<WellnessRecommendation[]>;
  
  createVideoSession(session: InsertVideoSession): Promise<VideoSession>;
  getVideoSessionsByUserId(userId: string): Promise<VideoSession[]>;
  getVideoSession(id: string): Promise<VideoSession | undefined>;
  
  createTranscript(transcript: InsertTranscript): Promise<Transcript>;
  getTranscript(id: string): Promise<Transcript | undefined>;
  getTranscriptsByUserId(userId: string): Promise<Transcript[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async createLifestyleQuestionnaire(insertQuestionnaire: InsertLifestyleQuestionnaire): Promise<LifestyleQuestionnaire> {
    const [questionnaire] = await db
      .insert(lifestyleQuestionnaires)
      .values(insertQuestionnaire)
      .returning();
    return questionnaire;
  }

  async getLifestyleQuestionnairesByUserId(userId: string): Promise<LifestyleQuestionnaire[]> {
    return await db
      .select()
      .from(lifestyleQuestionnaires)
      .where(eq(lifestyleQuestionnaires.userId, userId));
  }

  async createWellnessRecommendation(insertRecommendation: InsertWellnessRecommendation): Promise<WellnessRecommendation> {
    const [recommendation] = await db
      .insert(wellnessRecommendations)
      .values(insertRecommendation)
      .returning();
    return recommendation;
  }

  async getWellnessRecommendationsByUserId(userId: string): Promise<WellnessRecommendation[]> {
    return await db
      .select()
      .from(wellnessRecommendations)
      .where(eq(wellnessRecommendations.userId, userId));
  }

  async createVideoSession(insertSession: InsertVideoSession): Promise<VideoSession> {
    const [session] = await db
      .insert(videoSessions)
      .values(insertSession)
      .returning();
    return session;
  }

  async getVideoSessionsByUserId(userId: string): Promise<VideoSession[]> {
    return await db
      .select()
      .from(videoSessions)
      .where(eq(videoSessions.userId, userId));
  }

  async getVideoSession(id: string): Promise<VideoSession | undefined> {
    const [session] = await db
      .select()
      .from(videoSessions)
      .where(eq(videoSessions.id, id));
    return session || undefined;
  }

  async createTranscript(insertTranscript: InsertTranscript): Promise<Transcript> {
    const [transcript] = await db
      .insert(transcripts)
      .values(insertTranscript)
      .returning();
    return transcript;
  }

  async getTranscript(id: string): Promise<Transcript | undefined> {
    const [transcript] = await db
      .select()
      .from(transcripts)
      .where(eq(transcripts.id, id));
    return transcript || undefined;
  }

  async getTranscriptsByUserId(userId: string): Promise<Transcript[]> {
    return await db
      .select()
      .from(transcripts)
      .where(eq(transcripts.userId, userId));
  }
}

export const storage = new DatabaseStorage();
