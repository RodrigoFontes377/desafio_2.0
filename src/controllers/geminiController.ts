import { Request, Response } from "express";
import { getGeminiResponse } from "../services/geminiService";

export const askGemini = async (req: Request, res: Response): Promise<void> => {
  try {
    const { question } = req.body;

    if (!question) {
      res.status(400).json({ error: "Por favor, envie uma pergunta válida." });
      return;
    }

    const response = await getGeminiResponse(question);
    res.json({ model: "Gemini", question, response });
  } catch (error) {
    console.error("Erro no Gemini:", error);
    res
      .status(500)
      .json({ error: "Erro ao processar a requisição no Gemini." });
  }
};
