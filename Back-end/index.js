import express from "express";
const app = express();
const port = 3000;

import artistas from "./controllers/artistas.js";
import albumes from "./controllers/albumes.js";
import canciones from "./controllers/canciones.js";

app.use(express.json());

app.get("/", (_, res) => {
  res.send("SpoTICfy API working!");
});

const server = app.listen(port, () => {
  console.log(`SpoTICfy API listening at http://localhost:${port}`);
});

export { app, server };


// Rutas________________________________________________________________________________
