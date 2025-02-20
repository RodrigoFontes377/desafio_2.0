import axios from "axios";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY) {
  throw new Error(
    "Chave da API do OpenRouter não encontrada. Verifique o arquivo .env."
  );
}

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

export const getOpenRouterResponse = async (
  question: string
): Promise<string> => {
  try {
    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: "meta-llama/llama-3-70b-instruct",
        messages: [{ role: "user", content: question }],
        temperature: 1,
        top_p: 1,
        repetition_penalty: 1,
        max_tokens: 256,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("🔍 Resposta completa do OpenRouter:", response.data);

    // Se não houver escolhas válidas, retorna erro
    if (!response.data.choices || response.data.choices.length === 0) {
      console.error("O modelo não retornou resposta válida.");
      return "Erro: Nenhuma resposta válida foi retornada pelo modelo.";
    }

    return (
      response.data.choices[0].message.content || "Resposta vazia do modelo."
    );
  } catch (error) {
    console.error("Erro ao chamar a API do OpenRouter (LLaMA 3):", error);
    return "Erro ao obter resposta do OpenRouter (LLaMA 3).";
  }
};
