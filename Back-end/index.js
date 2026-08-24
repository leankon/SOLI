import express from "express";
import { pool } from "./db.js";

const app = express();

app.get('/', (req, res) => {
  res.send('Hola SOLI');
});

app.listen(3000, () => {
  console.log('Servidor corriendo en el puerto 3000');
});


// Rutas________________________________________________________________________________


  

