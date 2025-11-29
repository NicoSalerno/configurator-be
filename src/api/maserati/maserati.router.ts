import { Router } from "express";
import { allModels, DefaultModel, GetOptionalByModello, models } from "./maserati.controller";

const router = Router();

router.get("/allModels", allModels);
router.get("/model", models);
router.get("/optional", GetOptionalByModello);
router.get("/defaultModel", DefaultModel);

export default router;