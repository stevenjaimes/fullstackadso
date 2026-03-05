import { Router } from "express";
import {
  createMascotaHandler,
  deleteMascotaHandler,
  getMascotaByIdHandler,
  getMascotasHandler,
  updateMascotaHandler,
} from "../controllers/mascotas.controller.js";

const router = Router();

router.post("/", createMascotaHandler);
router.get("/", getMascotasHandler);
router.get("/:id", getMascotaByIdHandler);
router.put("/:id", updateMascotaHandler);
router.delete("/:id", deleteMascotaHandler);

export default router;
