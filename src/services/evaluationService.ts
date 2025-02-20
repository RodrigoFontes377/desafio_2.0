import axios from "axios";
import { getGeminiResponse } from "./geminiService";
import { getMistralResponse } from "./mistralService";
import { getOpenRouterResponse } from "./openRouterService";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

if (!OPENROUTER_API_KEY) {
  throw new Error(
    "Chave da API do OpenRouter não encontrada. Verifique o arquivo .env."
  );
}

const evaluationPrompt = (modelName: string, responses: any) => {
  return `
  Você é um avaliador imparcial e irá avaliar respostas geradas por IA.
  
  O modelo **${modelName}** precisa avaliar as respostas abaixo usando notas de **1 a 10** para cada critério.

  **Critérios:**
  1. Clareza
  2. Precisão
  3. Criatividade
  4. Gramática
  5. Profundidade
  6. Coerência

  **Respostas a serem avaliadas:**
  - **Gemini:** ${responses.gemini}
  - **Mistral:** ${responses.mistral}
  - **OpenRouter:** ${responses.openRouter}

  **Instruções:**
  - Avalie todas as respostas, incluindo a sua própria.
  - Dê uma nota de **1 a 10** para cada critério.
  - Retorne um JSON **sem explicações** no seguinte formato:
  \`\`\`json
  {
    "gemini": { "clareza": 9, "precisao": 8, "criatividade": 7, "gramatica": 10, "profundidade": 7, "coerencia": 8 },
    "mistral": { "clareza": 8, "precisao": 9, "criatividade": 6, "gramatica": 9, "profundidade": 8, "coerencia": 7 },
    "openRouter": { "clareza": 9, "precisao": 8, "criatividade": 9, "gramatica": 10, "profundidade": 7, "coerencia": 9 }
  }
  \`\`\`
  `;
};

// Função para um modelo específico avaliar todas as respostas
const getModelEvaluation = async (
  model: string,
  responses: any
): Promise<any> => {
  try {
    let evaluationResponse;

    if (model === "gemini") {
      evaluationResponse = await getGeminiResponse(
        evaluationPrompt("Gemini", responses)
      );
    } else if (model === "mistral") {
      evaluationResponse = await getMistralResponse(
        evaluationPrompt("Mistral", responses)
      );
    } else if (model === "openRouter") {
      const response = await axios.post(
        OPENROUTER_API_URL,
        {
          model: "meta-llama/llama-3-70b-instruct",
          messages: [
            {
              role: "user",
              content: evaluationPrompt("OpenRouter", responses),
            },
          ],
          temperature: 0,
          max_tokens: 512,
        },
        {
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
          timeout: 120000,
        }
      );

      if (response.data.choices && response.data.choices.length > 0) {
        evaluationResponse = response.data.choices[0].message?.content;
      } else {
        console.error(`Erro: OpenRouter não retornou uma avaliação válida.`);
        return { error: "Erro ao obter avaliação do OpenRouter" };
      }
    }

    if (!evaluationResponse) {
      console.error(`Erro: Avaliação de ${model} não retornou texto.`);
      return { error: `Erro ao processar a avaliação de ${model}` };
    }

    // Remove qualquer marcação ```json ... ```
    evaluationResponse = evaluationResponse.replace(/```json|```/g, "").trim();

    return JSON.parse(evaluationResponse);
  } catch (error) {
    console.error(`Erro ao avaliar respostas com ${model}:`, error);
    return { error: `Erro ao obter avaliação do ${model}` };
  }
};

// Função para obter avaliações de todos os modelos
export const evaluateAllModels = async (responses: any): Promise<any> => {
  try {
    console.log(" Iniciando avaliação...");

    const geminiEval = await getModelEvaluation("gemini", responses);
    console.log(" Gemini avaliou todas as respostas!");

    const mistralEval = await getModelEvaluation("mistral", responses);
    console.log(" Mistral avaliou todas as respostas!");

    const openRouterEval = await getModelEvaluation("openRouter", responses);
    console.log(" OpenRouter avaliou todas as respostas!");

    return {
      gemini: geminiEval,
      mistral: mistralEval,
      openRouter: openRouterEval,
    };
  } catch (error) {
    console.error("Erro ao avaliar com todos os modelos:", error);
    return { error: "Erro ao obter avaliações." };
  }
};

export const calculateFinalScores = (evaluations: any): any => {
  const models = Object.keys(evaluations);
  const finalScores: any = {};

  models.forEach((model) => {
    const scores = evaluations[model];

    if (scores.error) {
      finalScores[model] = { error: scores.error };
      return;
    }

    const criteria = Object.keys(scores[Object.keys(scores)[0]]);
    finalScores[model] = {}; // Mantém as médias por critério

    let totalSum = 0;
    let totalCount = 0;

    criteria.forEach((criterion) => {
      let total = 0;
      let count = 0;

      Object.keys(scores).forEach((evaluator) => {
        if (scores[evaluator] && scores[evaluator][criterion] !== undefined) {
          total += scores[evaluator][criterion];
          count++;
        }
      });

      const average = count > 0 ? total / count : 0;
      finalScores[model][criterion] = average.toFixed(2);

      // Acumulando valores para calcular a média final
      totalSum += average;
      totalCount++;
    });

    // Adiciona a nota final consolidada para cada modelo
    finalScores[model].nota_final =
      totalCount > 0 ? (totalSum / totalCount).toFixed(2) : "N/A";
  });

  return finalScores;
};
