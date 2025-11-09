import OpenAI from "openai";

// Using the javascript_openai blueprint
// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
}) : null;

interface QuestionnaireResponses {
  sleepHours: number;
  exerciseFrequency: string;
  stressLevel: number;
  socialConnection: string;
  dietQuality: string;
  screenTime: number;
}

function generateFallbackRecommendations(responses: any): string {
  return `Based on your lifestyle data, here are personalized wellness recommendations:

**Sleep Optimization:**
Your current sleep pattern indicates ${responses.sleepHours} hours per night. Aim for 7-9 hours of quality sleep by maintaining a consistent bedtime routine, keeping your bedroom cool and dark, and avoiding screens 1 hour before bed.

**Exercise and Movement:**
With your current activity level (${responses.exerciseFrequency}), consider incorporating at least 150 minutes of moderate aerobic activity or 75 minutes of vigorous activity per week. Start gradually and find activities you genuinely enjoy to build sustainable habits.

**Stress Management:**
Your stress level of ${responses.stressLevel}/10 suggests you could benefit from daily stress-reduction techniques. Try deep breathing exercises, meditation for 10-15 minutes daily, or journaling to process emotions. Regular physical activity also significantly reduces stress.

**Social Connection:**
${responses.socialConnection} is important for mental health. Make time for meaningful conversations with friends and family, join community groups or clubs aligned with your interests, and consider volunteering to build new connections.

**Nutrition:**
Your diet quality (${responses.dietQuality}) can be enhanced by focusing on whole foods - plenty of fruits, vegetables, lean proteins, and whole grains. Stay hydrated with at least 8 glasses of water daily, and limit processed foods and added sugars.

**Digital Wellness:**
With ${responses.screenTime} hours of screen time per day, consider implementing "digital sunsets" where you disconnect 1-2 hours before bed. Use the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds to reduce eye strain.

Remember, sustainable wellness comes from small, consistent changes. Start with one or two recommendations and build from there. You're taking an important step toward better health!`;
}

export async function generateWellnessRecommendations(
  responses: QuestionnaireResponses
): Promise<string> {
  if (!openai) {
    console.warn("OpenAI API key not configured, using fallback recommendations");
    return generateFallbackRecommendations(responses);
  }

  try {
    const prompt = `As a wellness expert, analyze the following lifestyle data and provide personalized, actionable recommendations to improve overall wellbeing. Be empathetic, specific, and practical.

Lifestyle Data:
- Sleep: ${responses.sleepHours} hours per night
- Exercise Frequency: ${responses.exerciseFrequency}
- Stress Level: ${responses.stressLevel}/10
- Social Connection: ${responses.socialConnection}
- Diet Quality: ${responses.dietQuality}
- Screen Time: ${responses.screenTime} hours per day

Provide comprehensive recommendations covering:
1. Sleep optimization
2. Exercise and movement
3. Stress management techniques
4. Social connection strategies
5. Nutrition improvements
6. Digital wellness and screen time balance

Format your response in clear, readable paragraphs with specific, actionable advice. Keep the tone warm, encouraging, and supportive.`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an empathetic wellness coach who provides personalized, evidence-based health and lifestyle recommendations. Your advice is practical, compassionate, and focuses on sustainable improvements."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_completion_tokens: 2048,
    });

    return response.choices[0].message.content || generateFallbackRecommendations(responses);
  } catch (error: any) {
    console.error("OpenAI API error:", error);
    
    if (error.status === 429 || error.code === 'insufficient_quota' || error.message?.includes('quota') || error.message?.includes('RateLimitError')) {
      console.warn("OpenAI quota exceeded or rate limited, using fallback recommendations");
      return generateFallbackRecommendations(responses);
    }
    
    return generateFallbackRecommendations(responses);
  }
}
