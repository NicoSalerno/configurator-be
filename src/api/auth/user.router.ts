import { Router } from "express";
import { loginMethod, me, registerMethod } from "./user.controller";

const router = Router();

router.get("/me", me);
router.post("/register", registerMethod);
router.post("/login", loginMethod);

export default router;
