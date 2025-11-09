import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Video, Heart, Camera, Languages, Smile, Shield, TrendingUp } from "lucide-react";

export default function Help() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-2">Help & Accessibility</h1>
      <p className="text-muted-foreground mb-8 text-lg">
        Learn how to use EmpaAI's features and accessibility tools
      </p>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              For Disabled Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" data-testid="accordion-video-upload">
                <AccordionTrigger className="text-base font-semibold">
                  How do I upload or record a video?
                </AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed">
                  <p className="mb-3">
                    On your dashboard, you'll see two options:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Upload Video:</strong> Click the "Upload Video" button to select a video file from your device</li>
                    <li><strong>Start Recording:</strong> Click "Start Recording" to use your camera and microphone to record a new video. Click "Stop Recording" when finished</li>
                  </ul>
                  <p className="mt-3">
                    Make sure to allow camera and microphone access when prompted by your browser for the best experience.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" data-testid="accordion-sign-language">
                <AccordionTrigger className="text-base font-semibold">
                  <div className="flex items-center gap-2">
                    <span>👋</span>
                    <span>What is sign language detection?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed">
                  <p className="mb-3">
                    Our AI analyzes your video to detect common sign language gestures and displays them as emojis. Each detection shows:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>The emoji representation of the gesture</li>
                    <li>The name of the detected gesture</li>
                    <li>A confidence percentage showing how certain the AI is</li>
                  </ul>
                  <p className="mt-3">
                    This feature helps bridge communication by visualizing sign language in an accessible format.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" data-testid="accordion-captions">
                <AccordionTrigger className="text-base font-semibold">
                  <div className="flex items-center gap-2">
                    <Languages className="h-4 w-4" />
                    <span>How do speech-to-text captions work?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed">
                  <p className="mb-3">
                    When you record a video, our system automatically transcribes spoken words into text captions in real-time. The captions appear below your video as you speak.
                  </p>
                  <p className="mb-3">
                    You can download your transcript at any time by clicking the "Download" button next to the captions section. The transcript will be saved as a text file on your device.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" data-testid="accordion-translation">
                <AccordionTrigger className="text-base font-semibold">
                  <div className="flex items-center gap-2">
                    <Languages className="h-4 w-4" />
                    <span>What languages are supported for translation?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed">
                  <p className="mb-3">
                    EmpaAI currently supports translation into three languages:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>🇬🇧 English</li>
                    <li>🇮🇳 Kannada (ಕನ್ನಡ)</li>
                    <li>🇮🇳 Hindi (हिंदी)</li>
                  </ul>
                  <p className="mt-3">
                    The system automatically detects audio in your video and provides translations in all three languages simultaneously.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" data-testid="accordion-facial">
                <AccordionTrigger className="text-base font-semibold">
                  <div className="flex items-center gap-2">
                    <Smile className="h-4 w-4" />
                    <span>How does facial expression analysis work?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed">
                  <p>
                    Our AI analyzes facial expressions in your video to detect emotions. The system identifies key facial features and patterns to determine your emotional state, displaying the result with an appropriate emoji and label.
                  </p>
                  <p className="mt-3">
                    This feature helps understand emotional context in communication, making interactions more empathetic and inclusive.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              For All Users (Wellness Features)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="wellness-1" data-testid="accordion-questionnaire">
                <AccordionTrigger className="text-base font-semibold">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    <span>What is the lifestyle questionnaire?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed">
                  <p className="mb-3">
                    The lifestyle questionnaire consists of 6 questions about your daily habits and wellness:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 ml-4">
                    <li>Sleep hours per night</li>
                    <li>Exercise frequency</li>
                    <li>Stress level (1-10 scale)</li>
                    <li>Social connection quality</li>
                    <li>Diet quality</li>
                    <li>Daily screen time</li>
                  </ol>
                  <p className="mt-3">
                    After completing the questionnaire, our AI analyzes your responses and provides personalized wellness recommendations to help improve your lifestyle.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="wellness-2" data-testid="accordion-mood-analysis">
                <AccordionTrigger className="text-base font-semibold">
                  <div className="flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    <span>How does webcam mood analysis work?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed">
                  <p className="mb-3">
                    Enable your webcam using the toggle switch on your dashboard. Our AI will analyze your facial expressions in real-time to detect your current mood.
                  </p>
                  <p className="mb-3">
                    The detected mood appears as an overlay on your webcam feed. You can disable the camera at any time using the same toggle switch to protect your privacy.
                  </p>
                  <p className="font-semibold text-primary">
                    Privacy Note: Video from your webcam is never stored or transmitted. All analysis happens locally in your browser.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="wellness-3" data-testid="accordion-recommendations">
                <AccordionTrigger className="text-base font-semibold">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    <span>What are wellness recommendations?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed">
                  <p className="mb-3">
                    After submitting your lifestyle questionnaire, our AI generates personalized recommendations to help improve your overall wellness. These may include:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Sleep quality improvement tips</li>
                    <li>Exercise and movement suggestions</li>
                    <li>Stress management techniques</li>
                    <li>Social connection strategies</li>
                    <li>Nutrition guidance</li>
                    <li>Screen time management advice</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="wellness-4" data-testid="accordion-analytics">
                <AccordionTrigger className="text-base font-semibold">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    <span>Understanding your lifestyle analytics</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed">
                  <p className="mb-3">
                    The pie chart on your dashboard visualizes your wellness metrics across four key areas:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Sleep Quality:</strong> Based on your reported sleep hours</li>
                    <li><strong>Exercise:</strong> Reflects your exercise frequency</li>
                    <li><strong>Stress Management:</strong> Inverse of your stress level (lower stress = higher score)</li>
                    <li><strong>Diet Quality:</strong> Based on your self-reported diet quality</li>
                  </ul>
                  <p className="mt-3">
                    Each segment shows the percentage contribution to your overall wellness score, helping you identify areas for improvement.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy & Accessibility
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Accessibility Features</h3>
              <ul className="list-disc list-inside space-y-2 ml-4 text-base">
                <li>High contrast mode available via theme toggle</li>
                <li>Keyboard navigation support throughout the application</li>
                <li>Screen reader compatible with ARIA labels</li>
                <li>Large, touch-friendly interface elements</li>
                <li>Responsive design for all devices</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Privacy Commitment</h3>
              <p className="text-base mb-3">
                EmpaAI is committed to protecting your privacy:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-base">
                <li>Webcam data is never stored or transmitted</li>
                <li>Video recordings are processed locally when possible</li>
                <li>Session data is cleared when you log out</li>
                <li>You control when camera and microphone are active</li>
                <li>AI processing is secure and confidential</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Browser Compatibility</h3>
              <p className="text-base">
                For the best experience, we recommend using the latest version of Chrome, Firefox, Safari, or Edge. Camera and speech recognition features require browser permission access.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
