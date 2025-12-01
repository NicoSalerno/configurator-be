import { Router } from "express";
import { allModels, CreateFileConfiguration, DefaultModel, GetOptionalByModello, models, ReadFileConfiguration } from "./maserati.controller";
import multer from 'multer';

const upload = multer({ dest: 'uploads/' }); // cartella temporanea
const router = Router();

router.get("/allModels", allModels);
router.get("/model", models);
router.get("/optional", GetOptionalByModello);
router.get("/defaultModel", DefaultModel);
router.post("/createFile", CreateFileConfiguration);
router.post("/readFile", ReadFileConfiguration);

export default router;
