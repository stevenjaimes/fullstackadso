import mysql from "mysql2/promise";

const DB_CLIENT = (process.env.DB_CLIENT || "mysql").toLowerCase();
let dbConnection = null;

async function connectDB() {
  if (dbConnection) return dbConnection;

  if (DB_CLIENT === "mysql") {
    dbConnection = mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER || "steven",
      password: process.env.DB_PASSWORD || "123456",
      database: process.env.DB_NAME || "db_vet",
      waitForConnections: true,
      connectionLimit: Number(process.env.DB_POOL_SIZE || 10),
      queueLimit: 0,
    });

    await dbConnection.query("SELECT 1");
    console.log("Conectado a MySQL");
    return dbConnection;
  }

  throw new Error(`DB_CLIENT="${DB_CLIENT}" no soportado. Usa: mysql.`);
}

async function disconnectDB() {
  if (!dbConnection) return;

  if (DB_CLIENT === "mysql") {
    await dbConnection.end();
  }

  dbConnection = null;
}

export {
  connectDB,
  disconnectDB,
};
