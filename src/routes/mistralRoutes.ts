import express from "express";
import { askMistral } from "../controllers/mistralController";

const router = express.Router();

router.post("/mistral", askMistral);

export default router;
