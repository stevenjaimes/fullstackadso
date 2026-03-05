import { connectDB } from "../db.js";

export async function getClientes() {
  const db = await connectDB();
  const [rows] = await db.query(
    "SELECT id_cliente, nombre, telefono, email FROM clientes ORDER BY nombre ASC"
  );

  return rows;
}

export async function createCliente({ nombre, telefono, email }) {
  const db = await connectDB();
  const [result] = await db.query(
    "INSERT INTO clientes (nombre, telefono, email) VALUES (?, ?, ?)",
    [nombre, telefono || null, email || null]
  );

  return result.insertId;
}
