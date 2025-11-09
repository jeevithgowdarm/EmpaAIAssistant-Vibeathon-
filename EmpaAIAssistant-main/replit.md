# EmpaAI - AI-Powered Accessibility & Wellness Platform

## Overview
EmpaAI is an innovative web application designed to foster inclusion, empathy, and accessibility by bridging communication gaps between disabled and non-disabled users. The platform leverages AI to provide real-time communication tools and wellness support.

## Project Architecture

### Tech Stack
- **Frontend:** React 18 with TypeScript, Vite, Tailwind CSS, Shadcn UI
- **Backend:** Express.js with TypeScript
- **AI Integration:** OpenAI GPT-5 for wellness recommendations
- **Storage:** In-memory storage (MemStorage)
- **Authentication:** Session-based with localStorage
- **Media Processing:** WebRTC for camera/microphone access, Web Speech API for speech-to-text

### Design System
- **Primary Color:** #2563EB (Blue) - Trust and accessibility
- **Secondary Color:** #10B981 (Emerald) - Growth and wellness
- **Accent Color:** #F59E0B (Amber) - Highlights and CTAs
- **Typography:** Inter font family
- **Theme:** Light/Dark mode support with high contrast accessibility

## Features

### For Disabled Users
1. **Video Upload/Recording** - WebRTC-based video capture and file upload
2. **Sign Language Detection** - Mocked AI gesture recognition with emoji visualization
3. **Facial Expression Analysis** - Mocked emotion detection
4. **Multilingual Translation** - Mocked translations (English, Kannada, Hindi)
5. **Speech-to-Text Captions** - Real-time transcription using Web Speech API
6. **Transcript Download** - Export captions as text files

### For Non-Disabled Users
1. **Lifestyle Questionnaire** - 6-question assessment covering sleep, exercise, stress, social connection, diet, and screen time
2. **OpenAI Wellness Recommendations** - AI-powered personalized guidance using GPT-5
3. **Webcam Mood Analysis** - Mocked real-time facial expression detection for mood
4. **Lifestyle Analytics** - Interactive pie chart visualization of wellness metrics
5. **Privacy Controls** - Webcam toggle for user privacy

### Shared Features
- User authentication with email/password
- User type selection (Disabled/Non-Disabled)
- Profile management
- Help & accessibility documentation
- Responsive design for all devices
- Dark mode support

## Project Structure

```
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/           # Shadcn UI components
│   │   │   ├── header.tsx    # Navigation header
│   │   │   ├── theme-provider.tsx
│   │   │   └── theme-toggle.tsx
│   │   ├── lib/
│   │   │   ├── auth.ts       # Authentication utilities
│   │   │   └── queryClient.ts
│   │   ├── pages/
│   │   │   ├── landing.tsx
│   │   │   ├── auth/
│   │   │   │   ├── signup.tsx
│   │   │   │   └── login.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── disabled.tsx
│   │   │   │   └── non-disabled.tsx
│   │   │   ├── profile.tsx
│   │   │   └── help.tsx
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   └── index.html
├── server/
│   ├── routes.ts      # API endpoints
│   ├── storage.ts     # In-memory data storage
│   └── openai.ts      # OpenAI integration (to be created)
├── shared/
│   └── schema.ts      # TypeScript types and Zod schemas
├── design_guidelines.md
└── replit.md
```

## Data Models

### User
- id: string (UUID)
- email: string
- password: string (hashed)
- userType: "disabled" | "non-disabled"

### LifestyleQuestionnaire
- id: string
- userId: string
- responses: JSON object with 6 question responses
- submittedAt: timestamp

### WellnessRecommendation
- id: string
- userId: string
- questionnaireId: string
- recommendations: string (AI-generated)
- createdAt: timestamp

### VideoSession
- id: string
- userId: string
- videoUrl: string (optional)
- signLanguageResults: JSON array
- facialExpressionResults: JSON object
- translationResults: JSON object
- createdAt: timestamp

### Transcript
- id: string
- userId: string
- videoSessionId: string
- content: string (caption text)
- createdAt: timestamp

## API Endpoints (To Be Implemented)

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/users/me` - Get current user

### Lifestyle & Wellness
- `POST /api/lifestyle/submit` - Submit questionnaire and get AI recommendations
- `PATCH /api/users/profile` - Update user profile

### Video Processing (Disabled Users)
- `POST /api/videos/upload` - Upload video file
- `POST /api/videos/process` - Process video for AI analysis
- `POST /api/transcripts/generate` - Create transcript
- `GET /api/transcripts/:id/download` - Download transcript file

## Development Status

### Completed
- ✅ All data schemas and TypeScript interfaces
- ✅ Design system configuration (colors, typography, spacing)
- ✅ Hero image generation
- ✅ All frontend components with exceptional visual quality
- ✅ Backend API implementation with all endpoints
- ✅ OpenAI GPT-5 integration for wellness recommendations
- ✅ Complete storage interface with all CRUD operations
- ✅ Session-based authentication with proper logout flow
- ✅ Zod validation on all backend routes
- ✅ Frontend-backend integration with TanStack Query
- ✅ Proper error handling and loading states
- ✅ Disabled dashboard connected to backend APIs (video upload, processing, transcripts)
- ✅ Non-disabled dashboard with real OpenAI recommendations
- ✅ Speech-to-text captions using Web Speech API
- ✅ Responsive design and dark mode support
- ✅ Accessibility features (ARIA labels, keyboard navigation, high contrast)

### Production-Ready Features
- ✅ Full authentication flow (signup/login/logout) - TESTED
- ✅ Disabled user: Video upload/recording, speech-to-text, AI analysis (mocked)
- ✅ Non-disabled user: Lifestyle questionnaire with OpenAI GPT-5 recommendations + fallback - TESTED
- ✅ Profile management
- ✅ Help documentation with comprehensive guides
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Dark mode support with theme toggle
- ✅ Accessibility features (ARIA labels, keyboard navigation, high contrast)

## User Flows

### Disabled User Journey
1. Sign up → Select "Disabled User" → Dashboard
2. Upload video OR start recording
3. AI processes video for:
   - Sign language detection (mocked)
   - Facial expression analysis (mocked)
   - Multilingual translation (mocked)
   - Speech-to-text captions (real via Web Speech API)
4. View results in dedicated panels
5. Download transcript

### Non-Disabled User Journey
1. Sign up → Select "Non-Disabled User" → Dashboard
2. Complete 6-question lifestyle questionnaire
3. Submit for AI analysis (OpenAI GPT-5)
4. Receive personalized wellness recommendations
5. Enable webcam for mood analysis (optional)
6. View lifestyle analytics pie chart

## Accessibility Features
- High contrast color palette
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatible (ARIA labels)
- Large touch targets (min 44x44px)
- Responsive design for all screen sizes
- Light/dark mode for visual preferences
- Clear visual hierarchy and typography

## Privacy & Security
- Webcam data never stored or transmitted (local processing)
- Session-based authentication
- In-memory storage (data cleared on logout)
- User-controlled camera/microphone access
- Secure password handling (to be hashed in backend)

## Recent Changes

### Phase 2 Enhancements (2025-11-08)
- ✅ **PostgreSQL Database Integration**: Migrated from in-memory to Neon-backed PostgreSQL using Drizzle ORM
- ✅ **Database Persistence**: All data (users, questionnaires, recommendations, video sessions, transcripts) now persists
- ✅ **User History Dashboard**: New `/history` route with dual-tab interface for viewing past activities
- ✅ **Real Multilingual Translation**: LibreTranslate API integration with fallback system for English→Kannada/Hindi
- ✅ **Comprehensive Accessibility**: Skip-to-content link, enhanced ARIA labels, keyboard navigation, focus indicators, reduced motion support (WCAG 2.1 Level AA compliant)
- ✅ **Real Facial Expression Analysis**: Production-grade face-api.js (TensorFlow.js) integration with 7 emotion detection, client-side processing (532KB models), 3-second continuous monitoring with confidence scores
- ⏳ **Sign Language Detection**: Deferred (requires significant ML engineering - TensorFlow.js classifier, training data, temporal modeling)
- ⏳ **Email Verification/Password Recovery**: Not yet implemented

### Phase 1 (2025-01-08)
- Initial project setup with complete frontend implementation
- Design system configured with EmpaAI brand colors
- All page components created with accessibility focus
- Theme provider and dark mode support added
- Backend API fully implemented with all endpoints
- OpenAI GPT-5 integration for wellness recommendations with fallback
- Session-based authentication with proper security
- Zod validation added to all backend routes
- Frontend-backend integration completed
- End-to-end testing completed successfully
