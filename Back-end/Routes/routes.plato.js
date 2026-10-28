import express from "express";
import verificarToken from "../middlewares/auth.js";
import platos from "../controllers/platos.js";

 const router = express.Router();

  // Platos
  router.get("/platos", verificarToken,platos.getPlatos);
  router.get("/platos/:id",verificarToken, platos.getPlato);
  router.post("/platos", verificarToken,platos.createPlato);
  router.put("/platos/:id", verificarToken,platos.updatePlato);
  router.delete("/platos/:id", verificarToken,platos.deletePlato);

  export default router;