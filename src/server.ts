import dotenv from "dotenv";
dotenv.config();

import express, { Application, Request, Response } from "express";
import geminiRoutes from "./routes/geminiRoutes";

const app: Application = express();
app.use(express.json());

app.use("/api", geminiRoutes);

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
