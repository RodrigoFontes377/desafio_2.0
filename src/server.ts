import dotenv from "dotenv";
dotenv.config();

import express, { Application, Request, Response } from "express";
import geminiRoutes from "./routes/geminiRoutes";
import mistralRoutes from "./routes/mistralRoutes";
import openRouterRoutes from "./routes/openRouterRoutes";
import multiModelRoutes from "./routes/multiModelRoutes";

const app: Application = express();
app.use(express.json());

app.use("/api", geminiRoutes);
app.use("/api", mistralRoutes);
app.use("/api", openRouterRoutes);
app.use("/api", multiModelRoutes);

app.get("/", (_req: Request, res: Response) => {
  res.send("Servidor rodando corretamente");
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
