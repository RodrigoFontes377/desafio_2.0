import express from "express";
import { askGemini } from "../controllers/geminiController";

const router = express.Router();

router.post("/ask", askGemini);

export default router;
