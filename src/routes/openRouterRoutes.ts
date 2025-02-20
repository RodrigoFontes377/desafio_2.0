import express from "express";
import { askOpenRouter } from "../controllers/openRouterController";

const router = express.Router();

router.post("/openrouter", askOpenRouter);

export default router;
