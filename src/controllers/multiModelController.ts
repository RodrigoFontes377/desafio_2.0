import { Request, Response } from "express";
import { getGeminiResponse } from "../services/geminiService";
import { getMistralResponse } from "../services/mistralService";
import { getOpenRouterResponse } from "../services/openRouterService";
import {
  evaluateAllModels,
  calculateFinalScores,
} from "../services/evaluationService";

export const askAllModels = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("Pergunta recebida:", req.body);

    const { question } = req.body;

    if (!question || typeof question !== "string") {
      console.error("Erro: Pergunta inválida");
      res.status(400).json({ error: "Por favor, envie uma pergunta válida." });
      return;
    }

    const [geminiResponse, mistralResponse, openRouterResponse] =
      await Promise.all([
        getGeminiResponse(question),
        getMistralResponse(question),
        getOpenRouterResponse(question),
      ]);

    const responses = {
      gemini: geminiResponse,
      mistral: mistralResponse,
      openRouter: openRouterResponse,
    };

    const evaluations = await evaluateAllModels(responses);

    // Calcula tanto as médias por critério quanto a nota final
    const finalScores = calculateFinalScores(evaluations);

    res.json({
      question,
      responses,
      evaluations,
      media_final: finalScores,
    });
  } catch (error) {
    console.error("Erro ao chamar os modelos:", error);
    res.status(500).json({ error: "Erro ao processar a requisição." });
  }
};
