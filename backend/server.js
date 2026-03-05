import express from "express";
import { connectDB, disconnectDB } from "./db.js";
import mascotasRoutes from "./routes/mascotas.routes.js";
import citasRoutes from "./routes/citas.routes.js";
import clientesRoutes from "./routes/clientes.routes.js";

const app = express();
const PORT = Number(process.env.PORT || 3000);
const ALLOWED_ORIGINS = new Set(["http://localhost:5500"]);

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Vary", "Origin");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  return next();
});
app.use(express.json());
app.use("/api/clientes", clientesRoutes);
app.use("/api/mascotas", mascotasRoutes);
app.use("/api/citas", citasRoutes);

app.get("/", (_req, res) => {
  res.send("Servidor backend funcionando");
});

app.get("/health", async (_req, res) => {
  try {
    const db = await connectDB();
    await db.query("SELECT 1");
    res.status(200).json({ ok: true, database: "connected" });
  } catch (error) {
    res.status(500).json({
      ok: false,
      database: "disconnected",
      error: error.message,
    });
  }
});

app.use((_req, res) => {
  res.status(404).json({ ok: false, message: "Endpoint no encontrado" });
});

const server = app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  } catch (error) {
    console.error("Error al conectar la base de datos:", error.message);
    process.exit(1);
  }
});

async function shutdown(signal) {
  console.log(`Recibido ${signal}. Cerrando servidor...`);

  server.close(async () => {
    try {
      await disconnectDB();
      console.log("Conexión a base de datos cerrada");
      process.exit(0);
    } catch (error) {
      console.error("Error cerrando la base de datos:", error.message);
      process.exit(1);
    }
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
