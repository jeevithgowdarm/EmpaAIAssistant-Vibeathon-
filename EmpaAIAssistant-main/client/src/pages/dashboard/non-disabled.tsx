import { useState, useRef, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, Heart, Camera, CameraOff, TrendingUp, Smile } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { detectFacialExpression, loadFaceApiModels } from "@/lib/faceDetection";

interface QuestionnaireData {
  sleepHours: number;
  exerciseFrequency: string;
  stressLevel: number;
  socialConnection: string;
  dietQuality: string;
  screenTime: number;
}

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

export default function NonDisabledDashboard() {
  const { toast } = useToast();
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  const [currentMood, setCurrentMood] = useState<string>("");
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendations, setRecommendations] = useState<string>("");
  const [formData, setFormData] = useState<QuestionnaireData>({
    sleepHours: 7,
    exerciseFrequency: "",
    stressLevel: 5,
    socialConnection: "",
    dietQuality: "",
    screenTime: 4,
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [moodConfidence, setMoodConfidence] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectionIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    const initModels = async () => {
      setModelsLoading(true);
      try {
        await loadFaceApiModels();
        console.log("Face-API models loaded successfully");
      } catch (error) {
        console.error("Failed to load face-api models:", error);
      } finally {
        setModelsLoading(false);
      }
    };

    initModels();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, []);

  const toggleWebcam = async () => {
    if (webcamEnabled) {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
        detectionIntervalRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setWebcamEnabled(false);
      setCurrentMood("");
      setMoodConfidence(0);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setWebcamEnabled(true);
        analyzeMood();
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Camera access denied",
          description: "Please allow camera access for mood analysis",
        });
      }
    }
  };

  const analyzeMood = async () => {
    if (!videoRef.current) return;

    await new Promise(resolve => setTimeout(resolve, 1000));

    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }

    const detectEmotion = async () => {
      if (!videoRef.current || !webcamEnabled) return;

      try {
        const result = await detectFacialExpression(videoRef.current);
        
        if (result) {
          setCurrentMood(result.emotion);
          setMoodConfidence(result.confidence);
          
          toast({
            title: "Mood detected",
            description: `You appear to be feeling ${result.emotion.toLowerCase()} (${(result.confidence * 100).toFixed(0)}% confidence)`,
          });
        }
      } catch (error) {
        console.error("Emotion detection error:", error);
      }
    };

    await detectEmotion();

    detectionIntervalRef.current = window.setInterval(detectEmotion, 3000);
  };

  const submitMutation = useMutation({
    mutationFn: async (data: QuestionnaireData) => {
      const result = await apiRequest("POST", "/api/lifestyle/submit", {
        responses: data,
      });
      return result;
    },
    onSuccess: (data) => {
      setRecommendations(data.recommendations);
      setShowRecommendations(true);
      
      const chartValues = [
        { name: 'Sleep Quality', value: (formData.sleepHours / 10) * 100 },
        { name: 'Exercise', value: formData.exerciseFrequency === 'daily' ? 100 : formData.exerciseFrequency === '3-5 times' ? 75 : formData.exerciseFrequency === '1-2 times' ? 50 : 25 },
        { name: 'Stress Management', value: (10 - formData.stressLevel) * 10 },
        { name: 'Diet Quality', value: formData.dietQuality === 'excellent' ? 100 : formData.dietQuality === 'good' ? 75 : formData.dietQuality === 'fair' ? 50 : 25 },
      ];
      setChartData(chartValues);

      toast({
        title: "Analysis complete",
        description: "Your personalized wellness recommendations are ready",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: error.message,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.exerciseFrequency || !formData.socialConnection || !formData.dietQuality) {
      toast({
        variant: "destructive",
        title: "Incomplete form",
        description: "Please answer all questions",
      });
      return;
    }

    submitMutation.mutate(formData);
  };

  const isFormComplete = formData.exerciseFrequency && formData.socialConnection && formData.dietQuality;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-2">Wellness Dashboard</h1>
      <p className="text-muted-foreground mb-8 text-lg">
        Complete the lifestyle questionnaire for personalized wellness insights
      </p>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Lifestyle Questionnaire
              </CardTitle>
              <CardDescription>Answer 6 questions about your daily habits</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-base font-semibold">1. How many hours do you sleep per night?</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[formData.sleepHours]}
                      onValueChange={(value) => setFormData({ ...formData, sleepHours: value[0] })}
                      min={4}
                      max={12}
                      step={0.5}
                      className="flex-1"
                      data-testid="slider-sleep"
                    />
                    <span className="text-lg font-semibold w-12 text-right" data-testid="text-sleep-hours">
                      {formData.sleepHours}h
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-semibold">2. How often do you exercise?</Label>
                  <Select
                    value={formData.exerciseFrequency}
                    onValueChange={(value) => setFormData({ ...formData, exerciseFrequency: value })}
                  >
                    <SelectTrigger data-testid="select-exercise">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="3-5 times">3-5 times per week</SelectItem>
                      <SelectItem value="1-2 times">1-2 times per week</SelectItem>
                      <SelectItem value="rarely">Rarely</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-semibold">3. Rate your stress level (1-10)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[formData.stressLevel]}
                      onValueChange={(value) => setFormData({ ...formData, stressLevel: value[0] })}
                      min={1}
                      max={10}
                      step={1}
                      className="flex-1"
                      data-testid="slider-stress"
                    />
                    <span className="text-lg font-semibold w-12 text-right" data-testid="text-stress-level">
                      {formData.stressLevel}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-semibold">4. How connected do you feel socially?</Label>
                  <RadioGroup
                    value={formData.socialConnection}
                    onValueChange={(value) => setFormData({ ...formData, socialConnection: value })}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="very-connected" id="very-connected" data-testid="radio-social-very" />
                      <Label htmlFor="very-connected" className="cursor-pointer font-normal">Very connected</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="somewhat-connected" id="somewhat-connected" data-testid="radio-social-somewhat" />
                      <Label htmlFor="somewhat-connected" className="cursor-pointer font-normal">Somewhat connected</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="isolated" id="isolated" data-testid="radio-social-isolated" />
                      <Label htmlFor="isolated" className="cursor-pointer font-normal">Feel isolated</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-semibold">5. How would you rate your diet quality?</Label>
                  <Select
                    value={formData.dietQuality}
                    onValueChange={(value) => setFormData({ ...formData, dietQuality: value })}
                  >
                    <SelectTrigger data-testid="select-diet">
                      <SelectValue placeholder="Select quality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-semibold">6. Daily screen time (hours)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[formData.screenTime]}
                      onValueChange={(value) => setFormData({ ...formData, screenTime: value[0] })}
                      min={1}
                      max={16}
                      step={1}
                      className="flex-1"
                      data-testid="slider-screen-time"
                    />
                    <span className="text-lg font-semibold w-12 text-right" data-testid="text-screen-time">
                      {formData.screenTime}h
                    </span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={!isFormComplete || submitMutation.isPending}
                  data-testid="button-submit-questionnaire"
                >
                  {submitMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Get Recommendations
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Mood Analysis
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Label htmlFor="webcam-toggle" className="text-sm cursor-pointer">
                    {webcamEnabled ? "Disable" : "Enable"} Camera
                  </Label>
                  <Switch
                    id="webcam-toggle"
                    checked={webcamEnabled}
                    onCheckedChange={toggleWebcam}
                    data-testid="switch-webcam"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
                {webcamEnabled ? (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      className="w-full h-full object-cover"
                      data-testid="video-webcam"
                    />
                    {currentMood && (
                      <div className="absolute bottom-4 left-4 right-4">
                        <Card className="bg-background/90 backdrop-blur-sm">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <Smile className="h-5 w-5 text-primary" />
                                <div>
                                  <p className="text-sm font-medium">Detected Mood</p>
                                  <p className="text-lg font-semibold" data-testid="text-current-mood">{currentMood}</p>
                                </div>
                              </div>
                              {moodConfidence > 0 && (
                                <div className="text-right">
                                  <p className="text-xs text-muted-foreground">Confidence</p>
                                  <p className="text-sm font-semibold text-primary">{(moodConfidence * 100).toFixed(0)}%</p>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <CameraOff className="h-12 w-12 mb-4 opacity-50" />
                    <p className="text-center">
                      Enable your camera for real-time mood analysis
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {chartData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Lifestyle Analytics
                </CardTitle>
                <CardDescription>Your wellness metrics overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80" data-testid="chart-lifestyle">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={showRecommendations} onOpenChange={setShowRecommendations}>
        <DialogContent className="max-w-2xl" data-testid="dialog-recommendations">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Heart className="h-6 w-6 text-primary" />
              Your Personalized Wellness Recommendations
            </DialogTitle>
            <DialogDescription>
              Based on your lifestyle questionnaire responses
            </DialogDescription>
          </DialogHeader>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <div className="whitespace-pre-wrap text-base leading-relaxed" data-testid="text-recommendations">
              {recommendations}
            </div>
          </div>
          <Button onClick={() => setShowRecommendations(false)} data-testid="button-close-recommendations">
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
