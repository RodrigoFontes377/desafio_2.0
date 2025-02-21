import axios from "axios";

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;

if (!MISTRAL_API_KEY) {
  throw new Error(
    "Chave da API do Mistral não encontrada. Verifique o arquivo .env."
  );
}

const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";

export const getMistralResponse = async (question: string): Promise<string> => {
  try {
    const response = await axios.post(
      MISTRAL_API_URL,
      {
        model: "mistral-medium",
        messages: [{ role: "user", content: question }],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${MISTRAL_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Erro ao chamar a API do Mistral:", error);
    return "Erro ao obter resposta do Mistral.";
  }
};
