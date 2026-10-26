import { pool } from "../db.js";
import jwt from "jsonwebtoken";

const getUsuarios = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, nombre, apellido, dni, nombre_usuario, rol FROM usuario WHERE nombre_usuario = (SELECT nombre_usuario FROM usuario WHERE id = $1) ORDER BY id",
[req.usuario.cuenta] );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
};

const getUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT id, nombre, apellido, dni, nombre_usuario, rol FROM usuario WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener el usuario" });
  }
};

const createUsuario = async (req, res) => {
  try {
    const { nombre, apellido, dni, nombre_usuario, contrasena, rol } = req.body;
    const result = await pool.query(
      `INSERT INTO usuario (nombre, apellido, dni, nombre_usuario, contraseña, rol)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, nombre, apellido, dni, nombre_usuario, rol`,
      [nombre, apellido, dni, nombre_usuario, contrasena, rol]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear el usuario" });
  }
};

const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, dni, nombre_usuario, rol } = req.body;
    const result = await pool.query(
      `UPDATE usuario SET nombre = $1, apellido = $2, dni = $3, nombre_usuario = $4, rol = $5
       WHERE id = $6 RETURNING id, nombre, apellido, dni, nombre_usuario, rol`,
      [nombre, apellido, dni, nombre_usuario, rol, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar el usuario" });
  }
};

const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM usuario WHERE id = $1 RETURNING id", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json({ mensaje: "Usuario eliminado" });
  } catch (err) {
    console.error(err);   
    res.status(500).json({ error: "Error al eliminar el usuario" });
  }
};

const login = async (req, res) => {
try{
 const {email, contrasena} = req.body;
 const respuesta = await pool.query("SELECT id, nombre, apellido, nombre_usuario, rol FROM usuario WHERE nombre_usuario = $1 AND contraseña = $2", [email, contrasena]);

 if (respuesta.rows.length===0){

  return res.status(401).json({error:"Usuario o contraseña incorrecta"})
 }
 const usuario =respuesta.rows[0];


 const resCuenta = await pool.query(
  "SELECT id FROM usuario WHERE nombre_usuario = $1 AND rol = 'encargado' ORDER BY id LIMIT 1",
  [email]
);
const cuenta = resCuenta.rows.length > 0 ? resCuenta.rows[0].id : usuario.id;

 
  const payload= {id: usuario.id, rol:usuario.rol, cuenta: cuenta};
  const secretKey = process.env.JWT_SECRET;
  const options = {expiresIn: '8h'};
  const token = jwt.sign  (payload,secretKey, options);
  res.json ({...usuario, token})


}
catch (err)  {
  console.error(err);
  res.status(500).json({ error: "Error al iniciar sesion" });

}

}

export default { getUsuarios, getUsuario, createUsuario, updateUsuario, deleteUsuario , login };



