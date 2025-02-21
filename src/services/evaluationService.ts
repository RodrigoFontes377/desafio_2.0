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

//  Função para criar o prompt de avaliação
const evaluationPrompt = (modelName: string, responses: any) => {
  return `
  Você é um avaliador de IA. Sua única função é analisar e avaliar as respostas geradas por IA.

  O modelo **${modelName}** deve avaliar as respostas abaixo usando notas de **1 a 10** para cada critério.

  **Critérios de avaliação:**
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
  - **IMPORTANTE:** A resposta **DEVE SER APENAS UM JSON VÁLIDO**.
  - **NÃO adicione explicações antes ou depois do JSON.**
  - **O JSON deve estar no seguinte formato exato:**
  \`\`\`json
  {
    "gemini": { "clareza": 9, "precisao": 8, "criatividade": 7, "gramatica": 10, "profundidade": 7, "coerencia": 8 },
    "mistral": { "clareza": 8, "precisao": 9, "criatividade": 6, "gramatica": 9, "profundidade": 8, "coerencia": 7 },
    "openRouter": { "clareza": 9, "precisao": 8, "criatividade": 9, "gramatica": 10, "profundidade": 7, "coerencia": 9 }
  }
  \`\`\`
  - **Se a resposta não for um JSON válido, a avaliação será descartada.**
  `;
};

//  Função para um modelo específico avaliar todas as respostas
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

    //  Removendo qualquer explicação antes do JSON
    const formattedResponse = evaluationResponse
      .replace(/```json|```/g, "") // Remove blocos de código markdown
      .replace(/^[^{[]+/, "") // Remove qualquer texto antes do JSON
      .trim();

    try {
      console.log(
        " Resposta bruta do OpenRouter antes de parsear:",
        formattedResponse
      );
      return JSON.parse(formattedResponse);
    } catch (error) {
      console.error(" Erro ao processar JSON do OpenRouter:", error);
      return {
        error: "Erro ao processar JSON da resposta de OpenRouter",
        rawResponse: formattedResponse,
      };
    }
  } catch (error) {
    console.error(`Erro ao avaliar respostas com ${model}:`, error);
    return { error: `Erro ao obter avaliação do ${model}` };
  }
};

// Função que avalia todas as respostas em paralelo
export const evaluateAllModels = async (responses: any): Promise<any> => {
  try {
    console.log(" Iniciando avaliação...");

    console.log(" Enviando respostas para Gemini...");
    const geminiEvalPromise = getModelEvaluation("gemini", responses);

    console.log(" Enviando respostas para Mistral...");
    const mistralEvalPromise = getModelEvaluation("mistral", responses);

    console.log(" Enviando respostas para OpenRouter...");
    const openRouterEvalPromise = getModelEvaluation("openRouter", responses);

    const [geminiEval, mistralEval, openRouterEval] = await Promise.all([
      geminiEvalPromise,
      mistralEvalPromise,
      openRouterEvalPromise,
    ]);

    console.log(" Todas as avaliações concluídas!");
    console.log("🔹 Resultado Gemini:", geminiEval);
    console.log("🔹 Resultado Mistral:", mistralEval);
    console.log("🔹 Resultado OpenRouter:", openRouterEval);

    return {
      gemini: geminiEval,
      mistral: mistralEval,
      openRouter: openRouterEval,
    };
  } catch (error) {
    console.error(" Erro ao avaliar com todos os modelos:", error);
    return { error: "Erro ao obter avaliações." };
  }
};

export const calculateFinalScores = (evaluations: any): any => {
  type Score = {
    model: string;
    notaFinal: string;
  };

  const models = Object.keys(evaluations);
  const finalScores: Score[] = [];

  models.forEach((model) => {
    const scores = evaluations[model];

    if (scores.error) {
      finalScores.push({ model, notaFinal: "Erro ao processar" });
      return;
    }

    const criteria = Object.keys(scores[Object.keys(scores)[0]]);
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
      totalSum += average;
      totalCount++;
    });

    const notaFinal = totalCount > 0 ? totalSum / totalCount : 0;

    finalScores.push({
      model,
      notaFinal: notaFinal.toFixed(2),
    });
  });

  finalScores.sort(
    (a: Score, b: Score) => parseFloat(b.notaFinal) - parseFloat(a.notaFinal)
  );

  const ranking = finalScores.map((item: Score, index: number) => ({
    posição: index + 1,
    modelo: item.model,
    notaFinal: item.notaFinal,
  }));

  return ranking;
};
