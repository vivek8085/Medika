import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const SYSTEM_INSTRUCTION = `You are a helpful medical assistant named Medika. Your responses should be informative, clear, and empathetic. 
Analyze the user's query, including any images provided. If appropriate, you may suggest common, over-the-counter medications that could help with the described symptoms, but you MUST preface this with a strong warning to consult a pharmacist or doctor first.

Your final output must be a valid JSON object with the following structure:
{
  "response": "Your detailed, empathetic, and informative response to the user's query goes here. Use markdown bullet points or numbered lists to structure your answer in a pointwise format whenever possible.",
  "suggestions": [
    "A relevant follow-up question.",
    "Another interesting related topic.",
    "A third suggestion to guide the conversation."
  ]
}

IMPORTANT: You must always include the following disclaimer at the end of your "response" text, formatted exactly as shown below:
---
**Disclaimer:** I am an AI assistant and not a substitute for a qualified medical professional. This information is for educational purposes only. Please consult a doctor for diagnosis and treatment of any health concerns.`;

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    response: { type: Type.STRING },
    suggestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
  },
  required: ['response', 'suggestions'],
};


export async function getMedicalResponse(
  prompt: string,
  image: { base64: string; mimeType: string } | null
): Promise<{ response: string; suggestions: string[] }> {
  try {
    const model = 'gemini-2.5-flash';
    const contents: any = { parts: [] };

    if (!prompt && image) {
      contents.parts.push({ text: "Describe this image from a medical perspective." });
    } else if (prompt) {
      contents.parts.push({ text: prompt });
    }

    if (image) {
      contents.parts.push({
        inlineData: {
          data: image.base64,
          mimeType: image.mimeType,
        },
      });
    }

    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });
    
    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error calling Gemini API or parsing JSON:", error);
    if (error instanceof Error) {
        throw new Error(`Error processing your request: ${error.message}`);
    }
    throw new Error("An unknown error occurred while processing your request.");
  }
}