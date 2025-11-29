import { Router } from "express";
import MaseratiRouter from "../api/maserati/maserati.router"

const router = Router();

router.use('/maserati', MaseratiRouter);

export default router;