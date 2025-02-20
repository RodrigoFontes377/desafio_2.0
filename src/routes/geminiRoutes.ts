import express from "express";
import { askGemini } from "../controllers/geminiController";

const router = express.Router();

router.post("/gemini", askGemini);

export default router;
