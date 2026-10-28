  import express from "express";
  import cors from "cors";
  
  import mesasRouter from "./Routes/routes.mesa.js";
  import platosRouter from "./Routes/routes.plato.js";
  import solicitudesRouter from "./Routes/routes.solicitud.js";
  import usuariosRouter from "./Routes/routes.usuario.js";
  import pideRouter from "./Routes/routes.pide.js";

  const app = express();
  const port = 3000;


  app.use(cors());
  app.use(express.json());

  app.use("/mesas", mesasRouter);
  app.use(platosRouter);
  app.use(solicitudesRouter);
  app.use(usuariosRouter);
  app.use(pideRouter);

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