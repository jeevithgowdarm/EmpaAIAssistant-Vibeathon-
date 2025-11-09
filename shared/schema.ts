import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  userType: text("user_type").notNull(), // "disabled" or "non-disabled"
});

export const lifestyleQuestionnaires = pgTable("lifestyle_questionnaires", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  responses: jsonb("responses").notNull(), // stores all 6 question responses
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
});

export const wellnessRecommendations = pgTable("wellness_recommendations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  questionnaireId: varchar("questionnaire_id").notNull(),
  recommendations: text("recommendations").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const videoSessions = pgTable("video_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  videoUrl: text("video_url"),
  signLanguageResults: jsonb("sign_language_results"), // array of detected gestures with emojis
  facialExpressionResults: jsonb("facial_expression_results"), // detected emotions
  translationResults: jsonb("translation_results"), // multilingual translations
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const transcripts = pgTable("transcripts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  videoSessionId: varchar("video_session_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertLifestyleQuestionnaireSchema = createInsertSchema(lifestyleQuestionnaires).omit({
  id: true,
  submittedAt: true,
});

export const insertWellnessRecommendationSchema = createInsertSchema(wellnessRecommendations).omit({
  id: true,
  createdAt: true,
});

export const insertVideoSessionSchema = createInsertSchema(videoSessions).omit({
  id: true,
  createdAt: true,
});

export const insertTranscriptSchema = createInsertSchema(transcripts).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertLifestyleQuestionnaire = z.infer<typeof insertLifestyleQuestionnaireSchema>;
export type LifestyleQuestionnaire = typeof lifestyleQuestionnaires.$inferSelect;

export type InsertWellnessRecommendation = z.infer<typeof insertWellnessRecommendationSchema>;
export type WellnessRecommendation = typeof wellnessRecommendations.$inferSelect;

export type InsertVideoSession = z.infer<typeof insertVideoSessionSchema>;
export type VideoSession = typeof videoSessions.$inferSelect;

export type InsertTranscript = z.infer<typeof insertTranscriptSchema>;
export type Transcript = typeof transcripts.$inferSelect;
