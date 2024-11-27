import { Router } from "express";
import { getRideHistory } from "../controllers/rideHistoryController";

const router = Router();

router.get("/:customer_id", getRideHistory);

export { router as getRoutes };
