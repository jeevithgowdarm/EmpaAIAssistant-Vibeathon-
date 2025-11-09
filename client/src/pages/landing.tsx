import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Video, Heart, MessageSquare, TrendingUp, Shield, Smile } from "lucide-react";
import heroImage from "@assets/generated_images/Inclusive_communication_with_sign_language_41b60f49.png";

export default function Landing() {
  return (
    <div className="min-h-screen">
      <section 
        className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
        aria-label="Hero section"
      >
        <div 
          className="absolute inset-0 z-0"
          role="img"
          aria-label="People communicating using sign language and technology, representing inclusive communication"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/70 to-primary/50" />
        </div>

        <div className="container relative z-10 mx-auto px-4 py-24 text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Bridging Communication,
            <br />
            Empowering Lives
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            EmpaAI fosters inclusion, empathy, and accessibility through AI-powered communication tools and wellness support for everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg px-8 py-6 h-auto" data-testid="button-hero-signup">
                Get Started Free
              </Button>
            </Link>
            <Link href="/help">
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-6 h-auto bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20"
                data-testid="button-hero-learn"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-background" aria-labelledby="features-heading">
        <div className="container mx-auto px-4">
          <h2 id="features-heading" className="text-4xl md:text-5xl font-bold text-center mb-6">
            Designed for Everyone
          </h2>
          <p className="text-xl text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
            Two powerful experiences tailored to your unique needs
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="p-8 hover-elevate transition-all" data-testid="card-disabled-features">
              <CardHeader className="p-0 mb-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Video className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl mb-2">For Disabled Users</CardTitle>
                <CardDescription className="text-base">
                  Advanced AI-powered communication tools
                </CardDescription>
              </CardHeader>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-base">Real-time sign language detection with emoji visualization</span>
                </li>
                <li className="flex items-start gap-3">
                  <Smile className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-base">Facial expression analysis for emotion detection</span>
                </li>
                <li className="flex items-start gap-3">
                  <MessageSquare className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-base">Multilingual translation (English, Kannada, Hindi)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Video className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-base">Speech-to-text captioning with downloadable transcripts</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 hover-elevate transition-all" data-testid="card-nondisabled-features">
              <CardHeader className="p-0 mb-6">
                <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle className="text-2xl mb-2">For All Users</CardTitle>
                <CardDescription className="text-base">
                  Wellness and lifestyle improvement guidance
                </CardDescription>
              </CardHeader>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-base">Personalized lifestyle questionnaire and insights</span>
                </li>
                <li className="flex items-start gap-3">
                  <Smile className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-base">Webcam-based mood analysis for emotional wellness</span>
                </li>
                <li className="flex items-start gap-3">
                  <Heart className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-base">AI-powered wellness recommendations</span>
                </li>
                <li className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-base">Lifestyle analytics with interactive visualizations</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Join EmpaAI today and experience the future of accessible communication and wellness support.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="text-lg px-8 py-6 h-auto" data-testid="button-cta-signup">
              Create Your Free Account
            </Button>
          </Link>
        </div>
      </section>

      <footer className="py-12 border-t bg-card">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p className="mb-4">
            EmpaAI is committed to accessibility, inclusion, and privacy for all users.
          </p>
          <p>&copy; 2025 EmpaAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
