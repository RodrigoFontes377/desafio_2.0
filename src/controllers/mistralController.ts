import { Request, Response } from "express";
import { getMistralResponse } from "../services/mistralService";

export const askMistral = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { question } = req.body;

    if (!question) {
      res.status(400).json({ error: "Por favor, envie uma pergunta válida." });
      return;
    }

    const response = await getMistralResponse(question);
    res.json({ model: "Mistral", question, response });
  } catch (error) {
    console.error("Erro no Mistral:", error);
    res
      .status(500)
      .json({ error: "Erro ao processar a requisição no Mistral." });
  }
};
