import express from "express";
import verificarToken from "../middlewares/auth.js";
import mesas from "../controllers/mesa.js";

const router = express.Router();

router.get("/", verificarToken, mesas.getMesas);
router.get("/:id", verificarToken, mesas.getMesa);
router.post("/", verificarToken, mesas.createMesa);
router.put("/:id", verificarToken, mesas.updateMesa);
router.delete("/:id", verificarToken, mesas.deleteMesa);

export default router;