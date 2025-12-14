import { Router } from "express";
import MaseratiRouter from "../api/maserati/maserati.router"
import UserRouter from "./auth/user.router"
const router = Router();

router.use('/maserati', MaseratiRouter);
router.use('/user', UserRouter);

export default router;