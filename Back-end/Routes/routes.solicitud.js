import express from "express";
import verificarToken from "../middlewares/auth.js";
import solicitudes from "../controllers/solicitud.js";

 const router = express.Router();
  // Solicitudes
  router.get("/solicitudes", verificarToken,solicitudes.getSolicitudes);
  router.get("/solicitudes/:id", verificarToken,solicitudes.getSolicitud);
  router.post("/solicitudes", solicitudes.createSolicitud);
  router.put("/solicitudes/:id", verificarToken,solicitudes.updateSolicitud);
  router.delete("/solicitudes/:id",verificarToken, solicitudes.deleteSolicitud);
 
  export default router;