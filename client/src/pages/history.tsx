import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Heart, Video, FileText, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getStoredUser } from "@/lib/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import type { LifestyleQuestionnaire, WellnessRecommendation, VideoSession, Transcript } from "@shared/schema";

export default function History() {
  const user = getStoredUser();

  const { data: questionnaireData, isLoading: loadingQuestionnaires } = useQuery<LifestyleQuestionnaire[]>({
    queryKey: ["/api/lifestyle/history"],
    enabled: user?.userType === "non-disabled",
  });
  const questionnaires = questionnaireData ?? [];

  const { data: recommendationData, isLoading: loadingRecommendations } = useQuery<WellnessRecommendation[]>({
    queryKey: ["/api/wellness/history"],
    enabled: user?.userType === "non-disabled",
  });
  const recommendations = recommendationData ?? [];

  const { data: videoData, isLoading: loadingVideos } = useQuery<VideoSession[]>({
    queryKey: ["/api/videos/history"],
    enabled: user?.userType === "disabled",
  });
  const videoSessions = videoData ?? [];

  const { data: transcriptData, isLoading: loadingTranscripts } = useQuery<Transcript[]>({
    queryKey: ["/api/transcripts/history"],
    enabled: user?.userType === "disabled",
  });
  const transcripts = transcriptData ?? [];

  if (!user) {
    return null;
  }

  const isDisabled = user.userType === "disabled";

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-2">Session History</h1>
      <p className="text-muted-foreground mb-8 text-lg">
        View your past activities and AI analysis results
      </p>

      {isDisabled ? (
        <Tabs defaultValue="videos" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="videos" data-testid="tab-videos">
              <Video className="h-4 w-4 mr-2" />
              Video Sessions
            </TabsTrigger>
            <TabsTrigger value="transcripts" data-testid="tab-transcripts">
              <FileText className="h-4 w-4 mr-2" />
              Transcripts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="videos" className="space-y-4">
            {loadingVideos ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : videoSessions && videoSessions.length > 0 ? (
              videoSessions.map((session) => (
                <Card key={session.id} data-testid={`card-session-${session.id}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Video className="h-5 w-5" />
                        Video Session
                      </span>
                      <Badge variant="secondary">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(new Date(session.createdAt), "MMM dd, yyyy")}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {session.signLanguageResults && Array.isArray(session.signLanguageResults) && (session.signLanguageResults as any[]).length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Sign Language Detected:</h4>
                        <div className="flex flex-wrap gap-2">
                          {(session.signLanguageResults as any[]).map((result: any, idx: number) => (
                            <Badge key={idx} variant="outline" className="text-sm">
                              {result.emoji} {result.gesture}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {session.facialExpressionResults && (
                      <div>
                        <h4 className="font-semibold mb-2">Facial Expression:</h4>
                        <Badge variant="secondary">
                          {(session.facialExpressionResults as any).emotion} ({((session.facialExpressionResults as any).confidence * 100).toFixed(0)}%)
                        </Badge>
                      </div>
                    )}
                    {session.translationResults && (
                      <div>
                        <h4 className="font-semibold mb-2">Translations:</h4>
                        <div className="grid gap-2 text-sm">
                          <div><strong>English:</strong> {(session.translationResults as any).english}</div>
                          <div><strong>Kannada:</strong> {(session.translationResults as any).kannada}</div>
                          <div><strong>Hindi:</strong> {(session.translationResults as any).hindi}</div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  No video sessions yet. Upload or record your first video on the dashboard!
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="transcripts" className="space-y-4">
            {loadingTranscripts ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : transcripts && transcripts.length > 0 ? (
              transcripts.map((transcript) => (
                <Card key={transcript.id} data-testid={`card-transcript-${transcript.id}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Speech Transcript
                      </span>
                      <Badge variant="secondary">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(new Date(transcript.createdAt), "MMM dd, yyyy")}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {transcript.content}
                    </p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  No transcripts yet. Create your first transcript on the dashboard!
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <Tabs defaultValue="questionnaires" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="questionnaires" data-testid="tab-questionnaires">
              <Heart className="h-4 w-4 mr-2" />
              Questionnaires
            </TabsTrigger>
            <TabsTrigger value="recommendations" data-testid="tab-recommendations">
              <FileText className="h-4 w-4 mr-2" />
              Recommendations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="questionnaires" className="space-y-4">
            {loadingQuestionnaires ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : questionnaires && questionnaires.length > 0 ? (
              questionnaires.map((q) => (
                <Card key={q.id} data-testid={`card-questionnaire-${q.id}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Heart className="h-5 w-5" />
                        Lifestyle Assessment
                      </span>
                      <Badge variant="secondary">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(new Date(q.submittedAt), "MMM dd, yyyy")}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-semibold">Sleep:</span> {(q.responses as any).sleepHours}h
                      </div>
                      <div>
                        <span className="font-semibold">Exercise:</span> {(q.responses as any).exerciseFrequency}
                      </div>
                      <div>
                        <span className="font-semibold">Stress Level:</span> {(q.responses as any).stressLevel}/10
                      </div>
                      <div>
                        <span className="font-semibold">Social:</span> {(q.responses as any).socialConnection}
                      </div>
                      <div>
                        <span className="font-semibold">Diet:</span> {(q.responses as any).dietQuality}
                      </div>
                      <div>
                        <span className="font-semibold">Screen Time:</span> {(q.responses as any).screenTime}h
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  No questionnaires yet. Complete your first assessment on the dashboard!
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4">
            {loadingRecommendations ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : recommendations && recommendations.length > 0 ? (
              recommendations.map((rec) => (
                <Card key={rec.id} data-testid={`card-recommendation-${rec.id}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Wellness Recommendations
                      </span>
                      <Badge variant="secondary">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(new Date(rec.createdAt), "MMM dd, yyyy")}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <p className="whitespace-pre-wrap text-sm">
                        {rec.recommendations}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  No recommendations yet. Submit a questionnaire to get personalized advice!
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
