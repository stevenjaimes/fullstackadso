import { connectDB } from "../db.js";

export async function createCita({ id_mascota, fecha, hora }) {
  const db = await connectDB();
  const [result] = await db.query(
    "INSERT INTO citas (id_mascota, fecha, hora) VALUES (?, ?, ?)",
    [id_mascota, fecha, hora]
  );

  return result.insertId;
}

export async function getCitas() {
  const db = await connectDB();
  const [rows] = await db.query(
    `SELECT c.id_cita, c.id_mascota, c.fecha, c.hora, m.nombre AS mascota
     FROM citas c
     LEFT JOIN mascotas m ON m.id_mascota = c.id_mascota
     ORDER BY c.id_cita DESC`
  );

  return rows;
}

export async function deleteCita(id) {
  const db = await connectDB();
  const [result] = await db.query("DELETE FROM citas WHERE id_cita = ?", [id]);

  return result.affectedRows;
}
