  import express from "express";
  const app = express();
  const port = 3000;

  import mesas from "./controllers/mesa.js";
  import platos from "./controllers/platos.js";
  import pedidos from "./controllers/pide.js";
  import solicitudes from "./controllers/solicitud.js";
  import usuarios from "./controllers/usuario.js";

  app.use(express.json());

  app.get("/", (_, res) => {
    res.send("SOLI API working!");
  });



  /* ------------------- Rutas ------------------- */


  // Mesas
  app.get("/mesas", mesas.getMesas);
  app.get("/mesas/:id", mesas.getMesa);
  app.post("/mesas", mesas.createMesa);
  app.put("/mesas/:id", mesas.updateMesa);
  app.delete("/mesas/:id", mesas.deleteMesa);

  // Usuarios
  app.get("/usuarios", usuarios.getUsuarios);
  app.get("/usuarios/:id", usuarios.getUsuario);
  app.post("/usuarios", usuarios.createUsuario);
  app.put("/usuarios/:id", usuarios.updateUsuario);
  app.delete("/usuarios/:id", usuarios.deleteUsuario);

  // Platos
  app.get("/platos", platos.getPlatos);
  app.get("/platos/:id", platos.getPlato);
  app.post("/platos", platos.createPlato);
  app.put("/platos/:id", platos.updatePlato);
  app.delete("/platos/:id", platos.deletePlato);

  // Solicitudes
  app.get("/solicitudes", solicitudes.getSolicitudes);
  app.get("/solicitudes/:id", solicitudes.getSolicitud);
  app.post("/solicitudes", solicitudes.createSolicitud);
  app.put("/solicitudes/:id", solicitudes.updateSolicitud);
  app.delete("/solicitudes/:id", solicitudes.deleteSolicitud);

  // Pide (pedidos)
  app.get("/pide", pedidos.getPide);
  app.get("/mesas/:id/pedido", pedidos.getPideByMesa);
  app.post("/pide", pedidos.createPide);
  app.delete("/pide/:id", pedidos.deletePide);


  const server = app.listen(port, () => {
    console.log(` API SOLI listening at http://localhost:${port}`);
  });

  export { app, server };