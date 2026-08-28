import { pool } from "../db.js";

const getMesas = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM mesa ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener las mesas" });
  }
};

const getMesa = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM mesa WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Mesa no encontrada" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener la mesa" });
  }
};

const createMesa = async (req, res) => {
  try {
    const { estado, numero } = req.body;
    const result = await pool.query(
      "INSERT INTO mesa (estado, numero) VALUES ($1, $2) RETURNING *",
      [estado, numero]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear la mesa" });
  }
};

const updateMesa = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, numero } = req.body;
    const result = await pool.query(
      "UPDATE mesa SET estado = $1, numero = $2 WHERE id = $3 RETURNING *",
      [estado, numero, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Mesa no encontrada" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar la mesa" });
  }
};

const deleteMesa = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM mesa WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Mesa no encontrada" });
    }
    res.json({ mensaje: "Mesa eliminada", mesa: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar la mesa" });
  }
};

export default { getMesas, getMesa, createMesa, updateMesa, deleteMesa };