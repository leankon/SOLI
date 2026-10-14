  import express from "express";
  import cors from "cors";
  import router from "./Routes/routes.js";
  const app = express();
  const port = 3000;


  app.use(cors());
  app.use(express.json());
  app.use(router);

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