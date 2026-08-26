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

const server = app.listen(port, () => {
  console.log(` API SOLI listening at http://localhost:${port}`);
});

export { app, server };


// Rutas________________________________________________________________________________
