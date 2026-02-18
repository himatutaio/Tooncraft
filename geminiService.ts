
import { GoogleGenAI, VideoGenerationReferenceType } from "@google/genai";
import { Character } from "./types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateCharacterImage = async (prompt: string): Promise<{ base64: string; url: string }> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: `A high-quality 3D Pixar-style animated character profile, professional CGI, cinematic lighting, detailed textures, expressive eyes, consistent studio style, solid white background: ${prompt}` }],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });

  let base64 = "";
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      base64 = part.inlineData.data;
      break;
    }
  }

  if (!base64) throw new Error("Geen afbeelding gegenereerd.");
  
  return {
    base64,
    url: `data:image/png;base64,${base64}`
  };
};

export const generateCartoonScene = async (prompt: string, characters: Character[]): Promise<string> => {
  const currentKey = process.env.API_KEY;
  const ai = getAI();
  
  const referenceImagesPayload = characters.slice(0, 3).map(char => ({
    image: {
      imageBytes: char.base64,
      mimeType: 'image/png',
    },
    referenceType: VideoGenerationReferenceType.ASSET,
  }));

  const charNames = characters.map(c => c.name).join(", ");
  const fullPrompt = `A cinematic 3D Pixar-style animated movie scene featuring the characters: ${charNames}. Scene description: ${prompt}. Professional 3D CGI animation, vibrant cinematic lighting, rich textures, expressive character animation, detailed background. Maintain strict visual consistency with the provided character references.`;

  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-generate-preview',
    prompt: fullPrompt,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9'
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) throw new Error("Video generatie mislukt.");
  
  const videoResponse = await fetch(`${downloadLink}&key=${currentKey}`);
  if (!videoResponse.ok) throw new Error(`Video download mislukt: ${videoResponse.statusText}`);
  
  const videoBlob = await videoResponse.blob();
  return URL.createObjectURL(videoBlob);
};

// --- NIEUWE EDUCATIEVE FUNCTIES ---

export const generateTextContent = async (systemInstruction: string, prompt: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      systemInstruction: systemInstruction,
    }
  });
  return response.text || "Fout bij genereren van tekst.";
};
