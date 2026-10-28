import { pool } from "../db.js";

const obtenerPlatos = async (cuenta) => {
  const result = await pool.query("SELECT * FROM platos WHERE id_usuario = $1 ORDER BY id", [cuenta]);
  return result.rows;
};

export default { obtenerPlatos };