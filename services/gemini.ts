import { GoogleGenAI } from "@google/genai";

// Helper to convert File to Base64
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const generateImageCaption = async (base64Image: string): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.warn("No API_KEY found in environment variables. Skipping AI caption.");
      return "Untitled Moment";
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg', // Assuming JPEG for simplicity, but could strictly check file type
              data: base64Image
            }
          },
          {
            text: "Generate a very short, artistic, lower-case caption (max 4 words) for this photo. It should feel like a memory. Just the caption, no quotes."
          }
        ]
      }
    });

    return response.text?.trim() || "Captured Memory";
  } catch (error) {
    console.error("Error generating caption with Gemini:", error);
    return "Untitled Moment";
  }
};
