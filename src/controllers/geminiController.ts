import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error(
    "Chave da API do Gemini não encontrada. Verifique o arquivo .env."
  );
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const getGeminiResponse = async (question: string): Promise<string> => {
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

export const askGemini = async (req: Request, res: Response): Promise<void> => {
  try {
    const { question } = req.body;

    if (!question) {
      res.status(400).json({ error: "Por favor, envie uma pergunta válida." });
      return;
    }

    const response = await getGeminiResponse(question);
    res.json({ question, response });
  } catch (error) {
    console.error("Erro interno:", error);
    res.status(500).json({ error: "Erro interno ao processar a requisição." });
  }
};
