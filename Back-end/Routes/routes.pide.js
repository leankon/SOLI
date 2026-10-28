import express from "express";
import verificarToken from "../middlewares/auth.js";
import pedidos from "../controllers/pide.js";

 const router = express.Router();

  // Pide (pedidos)
  router.get("/pide", verificarToken,pedidos.getPide);
  router.get("/mesas/:id/pedido", verificarToken,pedidos.getPideByMesa);
  router.post("/pide", verificarToken,pedidos.createPide);
  router.delete("/pide/:id", verificarToken,pedidos.deletePide);

  export default router;