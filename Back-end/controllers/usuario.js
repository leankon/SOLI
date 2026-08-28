import { pool } from "../db.js";

const getUsuarios = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, nombre, apellido, dni, nombre_usuario, rol FROM usuario ORDER BY id"
    );
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
    const { nombre, apellido, dni, nombre_usuario, contraseña, rol } = req.body;
    const result = await pool.query(
      `INSERT INTO usuario (nombre, apellido, dni, nombre_usuario, contraseña, rol)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, nombre, apellido, dni, nombre_usuario, rol`,
      [nombre, apellido, dni, nombre_usuario, contraseña, rol]
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

export default { getUsuarios, getUsuario, createUsuario, updateUsuario, deleteUsuario };