  import express from "express";
  import verificarToken from "../middlewares/auth.js";

    import mesas from "../controllers/mesa.js";
    import platos from "../controllers/platos.js";
    import pedidos from "../controllers/pide.js";
    import solicitudes from "../controllers/solicitud.js";
    import usuarios from "../controllers/usuario.js";
  
    const router = express.Router();
  
  
  /* ------------------- Rutas ------------------- */


  // Mesas
  router.get("/mesas", verificarToken, mesas.getMesas);
  router.get("/mesas/:id",  verificarToken, mesas.getMesa);
  router.post("/mesas", verificarToken, mesas.createMesa);
  router.put("/mesas/:id",  verificarToken,mesas.updateMesa);
  router.delete("/mesas/:id",verificarToken, mesas.deleteMesa);

  // Usuarios
  router.get("/usuarios", verificarToken,usuarios.getUsuarios);
  router.get("/usuarios/:id", verificarToken,usuarios.getUsuario);
  router.post("/usuarios", verificarToken, usuarios.createUsuario);
  router.put("/usuarios/:id", verificarToken,usuarios.updateUsuario);
  router.delete("/usuarios/:id", verificarToken,usuarios.deleteUsuario);

  router.post("/login", usuarios.login);
  

  // Platos
  router.get("/platos", verificarToken,platos.getPlatos);
  router.get("/platos/:id",verificarToken, platos.getPlato);
  router.post("/platos", verificarToken,platos.createPlato);
  router.put("/platos/:id", verificarToken,platos.updatePlato);
  router.delete("/platos/:id", verificarToken,platos.deletePlato);

  // Solicitudes
  router.get("/solicitudes", verificarToken,solicitudes.getSolicitudes);
  router.get("/solicitudes/:id", verificarToken,solicitudes.getSolicitud);
  router.post("/solicitudes", solicitudes.createSolicitud);
  router.put("/solicitudes/:id", verificarToken,solicitudes.updateSolicitud);
  router.delete("/solicitudes/:id",verificarToken, solicitudes.deleteSolicitud);

  // Pide (pedidos)
  router.get("/pide", verificarToken,pedidos.getPide);
  router.get("/mesas/:id/pedido", verificarToken,pedidos.getPideByMesa);
  router.post("/pide", verificarToken,pedidos.createPide);
  router.delete("/pide/:id", verificarToken,pedidos.deletePide);

  export default router;