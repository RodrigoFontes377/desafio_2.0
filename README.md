📌 Desafio Técnico - Comparador de LLMs

🎯 Objetivo
Desenvolver uma solução que acesse pelo menos três Modelos de Linguagem de Grande Escala (LLMs) diferentes, gere respostas para uma mesma pergunta e realize uma análise comparativa da qualidade das respostas.

🛠️ Tecnologias Utilizadas
Frontend: Next.js (React)
Backend: Express.js (Node.js)
Linguagem: TypeScript
APIs Utilizadas:
Gemini (Google Generative AI)
Mistral (Mistral AI)
OpenRouter (Acesso a múltiplos modelos)

🚀 Configuração do Projeto
📦 Instalação das Dependências
# No diretório do backend e frontend, execute:
npm install

▶️ Execução do Projeto
🔹 Backend
# Iniciar o servidor backend
npm run dev


Por padrão, o backend rodará em:
🔗 http://localhost:8080/api/all

🔧 Configuração de Variáveis de Ambiente
Para executar o projeto corretamente, é necessário criar um arquivo .env no backend e preencher com as chaves de API dos provedores:
GEMINI_API_KEY='SUA_CHAVE_AQUI'
MISTRAL_API_KEY='SUA_CHAVE_AQUI'
OPENROUTER_API_KEY='SUA_CHAVE_AQUI'

Onde obter as chaves:

Gemini (Google AI): [Obter chave](https://aistudio.google.com/apikey)
Mistral AI: [Obter chave](https://console.mistral.ai/api-keys)
OpenRouter (acesso a múltiplos modelos): [Obter chave](https://openrouter.ai/settings/keys)

📊 Comparação das Respostas e Avaliação
🔹 1️⃣ Recebimento do Prompt
📌 O usuário insere um prompt no frontend.

🔹 2️⃣ Geração das Respostas
📌 O backend chama os serviços GeminiService, MistralService e OpenRouterService.

🔹 3️⃣ Autoavaliação Assistida por IA
📌 As respostas geradas são enviadas para os próprios modelos avaliarem segundo critérios como clareza, precisão, criatividade e gramática.

🔹 4️⃣ Cálculo da Melhor Resposta
📌 A melhor resposta é definida com base na média das notas e exibida no frontend.

🏆 Ranking dos Modelos
🏅 Posição	📌 Modelo	⭐ Nota Final
🥇 1º	Mistral	8.67
🥈 2º	OpenRouter	8.06
🥉 3º	Gemini	8.00
📌 Conclusão
✅ Mistral teve o melhor desempenho geral, combinando clareza, precisão e criatividade.
✅ OpenRouter apresentou boas respostas, mas com desempenho irregular dependendo do modelo usado.
✅ Gemini se destacou na gramática e estrutura das respostas, mas perdeu pontos em precisão.

📩 Contato
Caso tenha alguma dúvida sobre a implementação, fique à vontade para entrar em contato! 🚀

👨‍💻 Desenvolvido por Rodrigo Sousa Fontes

