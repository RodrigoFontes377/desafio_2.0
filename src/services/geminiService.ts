import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error(
    "Chave da API do Gemini não encontrada. Verifique o arquivo .env."
  );
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const getGeminiResponse = async (question: string): Promise<string> => {
  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: question }] }],
    });

    return result.response.text();
  } catch (error) {
    console.error("Erro ao chamar a API do Gemini:", error);
    return "Erro ao obter resposta do Gemini.";
  }
};
