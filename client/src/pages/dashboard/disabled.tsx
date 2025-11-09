import { useState, useRef, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Video, Download, Maximize2, X, Loader2, Languages, Smile } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { getStoredUser } from "@/lib/auth";

export default function DisabledDashboard() {
  const { toast } = useToast();
  const user = getStoredUser();
  const [isRecording, setIsRecording] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [videoSessionId, setVideoSessionId] = useState<string>("");
  const [captions, setCaptions] = useState<string[]>([]);
  const [signLanguageDetections, setSignLanguageDetections] = useState<any[]>([]);
  const [facialExpression, setFacialExpression] = useState<any>(null);
  const [translations, setTranslations] = useState<any>({});
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        
        if (event.results[event.results.length - 1].isFinal) {
          setCaptions(prev => [...prev, transcript]);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const uploadVideoMutation = useMutation({
    mutationFn: async (file: File) => {
      return new Promise<any>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            const base64 = reader.result as string;
            const result = await apiRequest("POST", "/api/videos/upload", { 
              videoData: base64,
              fileName: file.name,
              fileType: file.type,
            });
            resolve(result);
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
      });
    },
    onSuccess: (data) => {
      setVideoSessionId(data.session.id);
      processVideoMutation.mutate(data.session.id);
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message,
      });
    },
  });

  const processVideoMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const result = await apiRequest("POST", "/api/videos/process", { sessionId });
      return result;
    },
    onSuccess: (data) => {
      setSignLanguageDetections(data.signLanguageResults || []);
      setFacialExpression(data.facialExpressionResults || null);
      setTranslations(data.translationResults || {});

      toast({
        title: "Processing complete",
        description: "All AI analysis results are ready",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Processing failed",
        description: error.message,
      });
    },
  });

  const generateTranscriptMutation = useMutation({
    mutationFn: async (data: { videoSessionId: string; content: string }) => {
      const result = await apiRequest("POST", "/api/transcripts/generate", data);
      return result;
    },
  });

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        const file = new File([blob], 'recording.webm', { type: 'video/webm' });
        setVideoFile(file);
        
        stream.getTracks().forEach(track => track.stop());
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }

        uploadVideoMutation.mutate(file);
      };

      mediaRecorder.start();
      setIsRecording(true);

      if (recognitionRef.current) {
        recognitionRef.current.start();
      }

      toast({
        title: "Recording started",
        description: "Speak clearly for best speech-to-text results",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Camera access denied",
        description: "Please allow camera and microphone access",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      toast({
        title: "Recording stopped",
        description: "Processing your video...",
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      uploadVideoMutation.mutate(file);
    }
  };

  const downloadTranscript = async () => {
    const transcriptText = captions.join('\n');
    
    if (videoSessionId && transcriptText) {
      try {
        await generateTranscriptMutation.mutateAsync({
          videoSessionId,
          content: transcriptText,
        });
      } catch (error) {
        console.error("Failed to save transcript:", error);
      }
    }

    const blob = new Blob([transcriptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Transcript downloaded",
      description: "Your transcript has been saved",
    });
  };

  const isProcessing = uploadVideoMutation.isPending || processVideoMutation.isPending;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-2">Accessibility Dashboard</h1>
      <p className="text-muted-foreground mb-8 text-lg">
        Upload or record a video to access AI-powered communication tools
      </p>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Video Input
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
                  {videoUrl || isRecording ? (
                    <>
                      <video
                        ref={videoRef}
                        src={videoUrl}
                        autoPlay={isRecording}
                        controls={!isRecording && videoUrl !== ""}
                        muted={isRecording}
                        className="w-full h-full object-cover"
                        data-testid="video-player"
                      />
                      {!isFullscreen && (
                        <Button
                          size="icon"
                          variant="secondary"
                          className="absolute top-2 right-2"
                          onClick={() => setIsFullscreen(true)}
                          data-testid="button-fullscreen"
                        >
                          <Maximize2 className="h-4 w-4" />
                        </Button>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <div className="text-center">
                        <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Upload or record a video to begin</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    data-testid="input-video-upload"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="flex-1"
                    disabled={isProcessing || isRecording}
                    data-testid="button-upload"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Video
                  </Button>
                  
                  {!isRecording ? (
                    <Button
                      onClick={startRecording}
                      className="flex-1"
                      disabled={isProcessing}
                      data-testid="button-record"
                    >
                      <Video className="mr-2 h-4 w-4" />
                      Start Recording
                    </Button>
                  ) : (
                    <Button
                      onClick={stopRecording}
                      variant="destructive"
                      className="flex-1"
                      data-testid="button-stop-recording"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Stop Recording
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Languages className="h-5 w-5" />
                  Live Captions
                </CardTitle>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={downloadTranscript}
                  disabled={captions.length === 0}
                  data-testid="button-download-transcript"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-48 w-full rounded-md border p-4 bg-muted/30">
                {captions.length > 0 ? (
                  <div className="space-y-2 font-mono text-sm" data-testid="text-captions">
                    {captions.map((caption, index) => (
                      <p key={index}>{caption}</p>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    Captions will appear here in real-time when you record a video
                  </p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                👋 Sign Language Detection
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isProcessing ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : signLanguageDetections.length > 0 ? (
                <div className="grid grid-cols-3 gap-4" data-testid="container-sign-language">
                  {signLanguageDetections.map((detection, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/50 hover-elevate"
                    >
                      <span className="text-4xl">{detection.emoji}</span>
                      <span className="text-sm font-medium text-center">{detection.gesture}</span>
                      <Badge variant="secondary" className="text-xs">
                        {(detection.confidence * 100).toFixed(0)}%
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm text-center py-8">
                  Sign language gestures will be detected and displayed here
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smile className="h-5 w-5" />
                Facial Expression
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isProcessing ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : facialExpression ? (
                <div className="text-center py-6" data-testid="text-facial-expression">
                  <div className="text-6xl mb-4">😊</div>
                  <p className="text-2xl font-semibold">{facialExpression.emotion}</p>
                  {facialExpression.confidence && (
                    <Badge variant="secondary" className="mt-2">
                      {(facialExpression.confidence * 100).toFixed(0)}% confident
                    </Badge>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm text-center py-8">
                  Facial expressions will be analyzed and displayed here
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Languages className="h-5 w-5" />
                Multilingual Translation
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isProcessing ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : Object.keys(translations).length > 0 ? (
                <div className="space-y-4" data-testid="container-translations">
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">🇬🇧</span>
                      <span className="font-semibold">English</span>
                    </div>
                    <p className="text-sm">{translations.english}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">🇮🇳</span>
                      <span className="font-semibold">Kannada</span>
                    </div>
                    <p className="text-sm">{translations.kannada}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">🇮🇳</span>
                      <span className="font-semibold">Hindi</span>
                    </div>
                    <p className="text-sm">{translations.hindi}</p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm text-center py-8">
                  Audio will be translated to multiple languages
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <video
            src={videoUrl}
            controls
            autoPlay
            className="max-w-full max-h-full"
            data-testid="video-fullscreen"
          />
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-4 right-4"
            onClick={() => setIsFullscreen(false)}
            data-testid="button-exit-fullscreen"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
}
