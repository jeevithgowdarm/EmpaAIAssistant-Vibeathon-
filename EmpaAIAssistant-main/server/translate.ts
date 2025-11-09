export interface TranslationResult {
  english: string;
  kannada: string;
  hindi: string;
}

export async function translateText(text: string): Promise<TranslationResult> {
  const apiKey = process.env.LIBRETRANSLATE_API_KEY;

  if (!apiKey) {
    console.warn("LIBRETRANSLATE_API_KEY not set. Using fallback translations. Get a free API key at https://portal.libretranslate.com");
    return {
      english: text,
      kannada: getSimpleFallbackTranslation(text, "kn"),
      hindi: getSimpleFallbackTranslation(text, "hi")
    };
  }

  try {
    const requestBody = {
      q: text,
      source: "en",
      format: "text",
      api_key: apiKey
    };

    const [kannadaResponse, hindiResponse] = await Promise.all([
      fetch("https://libretranslate.com/translate", {
        method: "POST",
        body: JSON.stringify({ ...requestBody, target: "kn" }),
        headers: { "Content-Type": "application/json" }
      }),
      fetch("https://libretranslate.com/translate", {
        method: "POST",
        body: JSON.stringify({ ...requestBody, target: "hi" }),
        headers: { "Content-Type": "application/json" }
      })
    ]);

    const [kannadaData, hindiData] = await Promise.all([
      kannadaResponse.json(),
      hindiResponse.json()
    ]);

    if (kannadaData.error || hindiData.error) {
      console.warn("LibreTranslate API error:", kannadaData.error || hindiData.error);
      return {
        english: text,
        kannada: getSimpleFallbackTranslation(text, "kn"),
        hindi: getSimpleFallbackTranslation(text, "hi")
      };
    }

    return {
      english: text,
      kannada: kannadaData.translatedText || text,
      hindi: hindiData.translatedText || text
    };
  } catch (error) {
    console.error("Translation error:", error);
    return {
      english: text,
      kannada: getSimpleFallbackTranslation(text, "kn"),
      hindi: getSimpleFallbackTranslation(text, "hi")
    };
  }
}

function getSimpleFallbackTranslation(text: string, lang: "kn" | "hi"): string {
  const fallbacks: Record<string, { kn: string; hi: string }> = {
    "hello, how are you today?": {
      kn: "ಹಲೋ, ನೀವು ಇಂದು ಹೇಗಿದ್ದೀರಿ?",
      hi: "नमस्ते, आप आज कैसे हैं?"
    },
    "thank you": {
      kn: "ಧನ್ಯವಾದಗಳು",
      hi: "धन्यवाद"
    },
    "goodbye": {
      kn: "ವಿದಾಯ",
      hi: "अलविदा"
    },
    "yes": {
      kn: "ಹೌದು",
      hi: "हाँ"
    },
    "no": {
      kn: "ಇಲ್ಲ",
      hi: "नहीं"
    }
  };

  const key = text.toLowerCase().trim();
  return fallbacks[key]?.[lang] || text;
}
