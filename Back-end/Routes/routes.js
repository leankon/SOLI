  import express from "express";

    import mesas from "../controllers/mesa.js";
    import platos from "../controllers/platos.js";
    import pedidos from "../controllers/pide.js";
    import solicitudes from "../controllers/solicitud.js";
    import usuarios from "../controllers/usuario.js";
  
    const router = expres.Router();
  
  
  /* ------------------- Rutas ------------------- */


  // Mesas
  router.get("/mesas", mesas.getMesas);
  router.get("/mesas/:id", mesas.getMesa);
  router.post("/mesas", mesas.createMesa);
  router.put("/mesas/:id", mesas.updateMesa);
  router.delete("/mesas/:id", mesas.deleteMesa);

  // Usuarios
  router.get("/usuarios", usuarios.getUsuarios);
  router.get("/usuarios/:id", usuarios.getUsuario);
  router.post("/usuarios", usuarios.createUsuario);
  router.put("/usuarios/:id", usuarios.updateUsuario);
  router.delete("/usuarios/:id", usuarios.deleteUsuario);

  router.post("/login", usuarios.login);
  

  // Platos
  router.get("/platos", platos.getPlatos);
  router.get("/platos/:id", platos.getPlato);
  router.post("/platos", platos.createPlato);
  router.put("/platos/:id", platos.updatePlato);
  router.delete("/platos/:id", platos.deletePlato);

  // Solicitudes
  router.get("/solicitudes", solicitudes.getSolicitudes);
  router.get("/solicitudes/:id", solicitudes.getSolicitud);
  router.post("/solicitudes", solicitudes.createSolicitud);
  router.put("/solicitudes/:id", solicitudes.updateSolicitud);
  router.delete("/solicitudes/:id", solicitudes.deleteSolicitud);

  // Pide (pedidos)
  router.get("/pide", pedidos.getPide);
  router.get("/mesas/:id/pedido", pedidos.getPideByMesa);
  router.post("/pide", pedidos.createPide);
  router.delete("/pide/:id", pedidos.deletePide);

  export default router;