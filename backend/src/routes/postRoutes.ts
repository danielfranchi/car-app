import { Router } from "express";
import { estimateRide } from "../controllers/estimateController";

const router = Router();

router.post("/estimate", estimateRide);

export { router as postRoutes };
