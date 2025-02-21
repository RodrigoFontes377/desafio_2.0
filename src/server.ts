import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

// Configura as variáveis de ambiente
dotenv.config();

// Inicializa o Express
const app: Application = express();

// Middleware para permitir requisições CORS
app.use(cors());
app.use(express.json());

// Importa as rotas
import geminiRoutes from "./routes/geminiRoutes";
import mistralRoutes from "./routes/mistralRoutes";
import openRouterRoutes from "./routes/openRouterRoutes";
import multiModelRoutes from "./routes/multiModelRoutes";

// Usa as rotas
app.use("/api", geminiRoutes);
app.use("/api", mistralRoutes);
app.use("/api", openRouterRoutes);
app.use("/api", multiModelRoutes);

// Rota para testar se o servidor está rodando
app.get("/", (_req: Request, res: Response) => {
  res.send("Servidor rodando corretamente");
});

// Define a porta do servidor
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
