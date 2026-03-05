import { Router } from "express";
import {
  createClienteHandler,
  getClientesHandler,
} from "../controllers/clientes.controller.js";

const router = Router();

router.get("/", getClientesHandler);
router.post("/", createClienteHandler);

export default router;
