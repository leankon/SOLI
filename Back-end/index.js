  // Paso 2 (esto va en CADA archivo que use express)
  const express = require('express');

  const app = express();

  app.get('/', (req, res) => {
    res.send('Hola SOLI');
  });

  app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000');
  });