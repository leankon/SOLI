import express from "express";
import verificarToken from "../middlewares/auth.js";
import usuarios from "../controllers/usuario.js";


 const router = express.Router();
 
  // Usuarios
  router.get("/usuarios", verificarToken,usuarios.getUsuarios);
  router.get("/usuarios/:id", verificarToken,usuarios.getUsuario);
  router.post("/usuarios", verificarToken, usuarios.createUsuario);
  router.put("/usuarios/:id", verificarToken,usuarios.updateUsuario);
  router.delete("/usuarios/:id", verificarToken,usuarios.deleteUsuario);

  router.post("/login", usuarios.login);
  
  export default router;