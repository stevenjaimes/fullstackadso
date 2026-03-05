import { connectDB } from "../db.js";

export async function createMascota({ nombre, tipo, edad, id_cliente }) {
  const db = await connectDB();
  const [result] = await db.query(
    "INSERT INTO mascotas (nombre, tipo, edad, id_cliente) VALUES (?, ?, ?, ?)",
    [nombre, tipo, edad, id_cliente]
  );

  return result.insertId;
}

export async function getMascotas() {
  const db = await connectDB();
  const [rows] = await db.query(
    `SELECT m.id_mascota, m.nombre, m.tipo, m.edad, m.id_cliente, c.nombre AS cliente_nombre
     FROM mascotas m
     INNER JOIN clientes c ON c.id_cliente = m.id_cliente
     ORDER BY m.id_mascota DESC`
  );

  return rows;
}

export async function getMascotaById(id) {
  const db = await connectDB();
  const [rows] = await db.query(
    `SELECT m.id_mascota, m.nombre, m.tipo, m.edad, m.id_cliente, c.nombre AS cliente_nombre
     FROM mascotas m
     INNER JOIN clientes c ON c.id_cliente = m.id_cliente
     WHERE m.id_mascota = ?`,
    [id]
  );

  return rows[0] || null;
}

export async function updateMascota(id, { nombre, tipo, edad, id_cliente }) {
  const db = await connectDB();
  const [result] = await db.query(
    "UPDATE mascotas SET nombre = ?, tipo = ?, edad = ?, id_cliente = ? WHERE id_mascota = ?",
    [nombre, tipo, edad, id_cliente, id]
  );

  return result.affectedRows;
}

export async function deleteMascota(id) {
  const db = await connectDB();
  const [result] = await db.query("DELETE FROM mascotas WHERE id_mascota = ?", [id]);

  return result.affectedRows;
}
