import express from "express";
import { askAllModels } from "../controllers/multiModelController";

const router = express.Router();

router.post("/all", askAllModels);

export default router;
