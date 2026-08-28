import { pool } from "../db.js";

const getPlatos = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM platos ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener los platos" });
  }
};

const getPlato = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM platos WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Plato no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener el plato" });
  }
};

const createPlato = async (req, res) => {
  try {
    const { nombre, precio, id_usuario } = req.body;
    const result = await pool.query(
      "INSERT INTO platos (nombre, precio, id_usuario) VALUES ($1, $2, $3) RETURNING *",
      [nombre, precio, id_usuario]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear el plato" });
  }
};

const updatePlato = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, precio, id_usuario } = req.body;
    const result = await pool.query(
      "UPDATE platos SET nombre = $1, precio = $2, id_usuario = $3 WHERE id = $4 RETURNING *",
      [nombre, precio, id_usuario, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Plato no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar el plato" });
  }
};

const deletePlato = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM platos WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Plato no encontrado" });
    }
    res.json({ mensaje: "Plato eliminado", plato: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar el plato" });
  }
};

export default { getPlatos, getPlato, createPlato, updatePlato, deletePlato };