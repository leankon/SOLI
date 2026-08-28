import { pool } from "../db.js";

const getPide = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM pide ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener los pedidos" });
  }
};

const getPideByMesa = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT p.id, pl.nombre AS plato, pl.precio, p.cantidad, p.hora, p.fecha
       FROM pide p
       JOIN platos pl ON p.platos_id = pl.id
       WHERE p.mesa_id = $1
       ORDER BY p.fecha, p.hora`,
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener los pedidos de la mesa" });
  }
};

const createPide = async (req, res) => {
  try {
    const { mesa_id, platos_id, cantidad } = req.body;
    const result = await pool.query(
      `INSERT INTO pide (mesa_id, platos_id, cantidad, hora, fecha)
       VALUES ($1, $2, $3, CURRENT_TIME, CURRENT_DATE) RETURNING *`,
      [mesa_id, platos_id, cantidad]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear el pedido" });
  }
};

const deletePide = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM pide WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }
    res.json({ mensaje: "Pedido eliminado", pedido: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar el pedido" });
  }
};

export default { getPide, getPideByMesa, createPide, deletePide };