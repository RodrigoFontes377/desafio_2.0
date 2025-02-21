import { Request, Response } from "express";
import { getOpenRouterResponse } from "../services/openRouterService";

export const askOpenRouter = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("🔍 Corpo da requisição recebido:", req.body); // Debug

    const { messages } = req.body;

    if (
      !messages ||
      !Array.isArray(messages) ||
      messages.length === 0 ||
      !messages[0].content
    ) {
      console.error("❌ Erro: Nenhuma mensagem válida foi recebida");
      res.status(400).json({ error: "Por favor, envie uma pergunta válida." });
      return;
    }

    const question = messages[0].content;
    const response = await getOpenRouterResponse(question);
    res.json({ model: "OpenRouter (LLaMA 3)", question, response });
  } catch (error) {
    console.error("❌ Erro no OpenRouter:", error);
    res
      .status(500)
      .json({ error: "Erro ao processar a requisição no OpenRouter." });
  }
};
