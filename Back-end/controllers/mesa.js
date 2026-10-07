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
    const { numero, estado, x, y, tamano, forma , lugares } = req.body;
    const result = await pool.query(
      `INSERT INTO mesa (numero, estado, x, y, tamano, forma , lugares)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [numero, estado, x, y, tamano, forma , lugares]
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
    const { numero, estado, x, y, tamano, forma,lugares } = req.body;
    const result = await pool.query(
      `UPDATE mesa SET numero = $1, estado = $2, x = $3, y = $4, tamano = $5, forma = $6 , lugares=$7
       WHERE id = $8 RETURNING * `,
      [numero, estado, x, y, tamano, forma, lugares , id]
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