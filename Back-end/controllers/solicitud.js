import { pool } from "../db.js";

const getSolicitudes = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM solicitud ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener las solicitudes" });
  }
};

const getSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM solicitud WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Solicitud no encontrada" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener la solicitud" });
  }
};

const createSolicitud = async (req, res) => {
  try {
    const { estado, fecha, tipo, hora, id_usuario, id_mesa } = req.body;
    const result = await pool.query(
      `INSERT INTO solicitud (estado, fecha, tipo, hora, id_usuario, id_mesa)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [estado, fecha, tipo, hora, id_usuario, id_mesa]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear la solicitud" });
  }
};

const updateSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, id_usuario } = req.body;
    const result = await pool.query(
      "UPDATE solicitud SET estado = $1, id_usuario = $2 WHERE id = $3 RETURNING *",
      [estado, id_usuario, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Solicitud no encontrada" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar la solicitud" });
  }
};

const deleteSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM solicitud WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Solicitud no encontrada" });
    }
    res.json({ mensaje: "Solicitud eliminada", solicitud: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar la solicitud" });
  }
};

export default { getSolicitudes, getSolicitud, createSolicitud, updateSolicitud, deleteSolicitud };