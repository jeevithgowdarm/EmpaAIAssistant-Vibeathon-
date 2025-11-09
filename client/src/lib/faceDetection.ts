import * as faceapi from 'face-api.js';

let modelsLoaded = false;

export async function loadFaceApiModels(): Promise<void> {
  if (modelsLoaded) return;

  try {
    const MODEL_URL = '/models';
    
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
    ]);
    
    modelsLoaded = true;
    console.log('Face-API models loaded successfully');
  } catch (error) {
    console.error('Error loading face-api models:', error);
    throw error;
  }
}

export interface EmotionResult {
  emotion: string;
  confidence: number;
  allEmotions: Record<string, number>;
}

export async function detectFacialExpression(
  video: HTMLVideoElement
): Promise<EmotionResult | null> {
  try {
    if (!modelsLoaded) {
      await loadFaceApiModels();
    }

    const detection = await faceapi
      .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();

    if (!detection) {
      return null;
    }

    const expressions = detection.expressions;
    const emotionEntries = Object.entries(expressions).sort((a, b) => b[1] - a[1]);
    const topEmotion = emotionEntries[0];

    const emotionMap: Record<string, string> = {
      neutral: 'Neutral',
      happy: 'Happy',
      sad: 'Sad',
      angry: 'Angry',
      fearful: 'Fearful',
      disgusted: 'Disgusted',
      surprised: 'Surprised'
    };

    return {
      emotion: emotionMap[topEmotion[0]] || topEmotion[0],
      confidence: topEmotion[1],
      allEmotions: Object.fromEntries(
        emotionEntries.map(([emotion, score]) => [emotionMap[emotion] || emotion, score])
      )
    };
  } catch (error) {
    console.error('Error detecting facial expression:', error);
    return null;
  }
}
