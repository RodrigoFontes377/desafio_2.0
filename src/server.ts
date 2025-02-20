import dotenv from "dotenv";
dotenv.config();

import express, { Application, Request, Response } from "express";
import geminiRoutes from "./routes/geminiRoutes";
import mistralRoutes from "./routes/mistralRoutes";
import openRouterRoutes from "./routes/openRouterRoutes";
import multiModelRoutes from "./routes/multiModelRoutes"; // Importa a nova rota

const app: Application = express();
app.use(express.json());

// Importação das rotas corretamente dentro de "/api"
app.use("/api", geminiRoutes);
app.use("/api", mistralRoutes);
app.use("/api", openRouterRoutes);
app.use("/api", multiModelRoutes); // Adiciona a nova rota

app.get("/", (_req: Request, res: Response) => {
  res.send("Servidor rodando corretamente");
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log("Rotas registradas:");
  app._router.stack.forEach((layer: any) => {
    if (layer.route) {
      console.log(layer.route.path);
    } else if (layer.name === "router") {
      layer.handle.stack.forEach((subLayer: any) => {
        if (subLayer.route) {
          console.log(`/api${subLayer.route.path}`);
        }
      });
    }
  });
});
