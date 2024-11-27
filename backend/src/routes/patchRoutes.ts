import { Router } from "express";
import { confirmRide } from "../controllers/confirmController";

const router = Router();

router.patch("/confirm", confirmRide);

export { router as patchRoutes };
