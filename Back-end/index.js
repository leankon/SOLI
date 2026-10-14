  import express from "express";
  import cors from "cors";
  const app = express();
  const port = 3000;

  import mesas from "./controllers/mesa.js";
  import platos from "./controllers/platos.js";
  import pedidos from "./controllers/pide.js";
  import solicitudes from "./controllers/solicitud.js";
  import usuarios from "./controllers/usuario.js";

  app.use(cors());
  app.use(express.json());

  app.get("/", (_, res) => {
    res.send("SOLI API working!");
  });


  // Vercel no usa app.listen. Este if hace que el servidor solo
  // se levante cuando corres el proyecto en tu maquina.
  if (!process.env.VERCEL) {
    app.listen(port, () => {
      console.log(` API SOLI listening at http://localhost:${port}`);
    });
  }

  export default app;