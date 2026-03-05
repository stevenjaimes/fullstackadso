import { Router } from "express";
import {
  createCitaHandler,
  deleteCitaHandler,
  getCitasHandler,
} from "../controllers/citas.controller.js";

const router = Router();

router.post("/", createCitaHandler);
router.get("/", getCitasHandler);
router.delete("/:id", deleteCitaHandler);

export default router;
