import {
  createMascota,
  deleteMascota,
  getMascotaById,
  getMascotas,
  updateMascota,
} from "../repositories/mascotas.repository.js";

export async function createMascotaHandler(req, res) {
  try {
    const { nombre, tipo, edad, id_cliente } = req.body;

    if (!nombre || !tipo || edad == null || !id_cliente) {
      return res.status(400).json({
        ok: false,
        message: "Campos requeridos: nombre, tipo, edad, id_cliente",
      });
    }

    const id_mascota = await createMascota({ nombre, tipo, edad, id_cliente });

    return res.status(201).json({
      ok: true,
      message: "Mascota registrada",
      data: { id_mascota, nombre, tipo, edad, id_cliente },
    });
  } catch (error) {
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({
        ok: false,
        message: "El dueno seleccionado no existe",
      });
    }

    return res.status(500).json({ ok: false, message: error.message });
  }
}

export async function getMascotasHandler(_req, res) {
  try {
    const rows = await getMascotas();
    return res.status(200).json({ ok: true, data: rows });
  } catch (error) {
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({
        ok: false,
        message: "El dueno seleccionado no existe",
      });
    }

    return res.status(500).json({ ok: false, message: error.message });
  }
}

export async function getMascotaByIdHandler(req, res) {
  try {
    const { id } = req.params;
    const mascota = await getMascotaById(id);

    if (!mascota) {
      return res.status(404).json({ ok: false, message: "Mascota no encontrada" });
    }

    return res.status(200).json({ ok: true, data: mascota });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
}

export async function updateMascotaHandler(req, res) {
  try {
    const { id } = req.params;
    const { nombre, tipo, edad, id_cliente } = req.body;

    if (!nombre || !tipo || edad == null || !id_cliente) {
      return res.status(400).json({
        ok: false,
        message: "Campos requeridos: nombre, tipo, edad, id_cliente",
      });
    }

    const affectedRows = await updateMascota(id, { nombre, tipo, edad, id_cliente });

    if (affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Mascota no encontrada" });
    }

    return res.status(200).json({
      ok: true,
      message: "Mascota actualizada",
      data: { id_mascota: Number(id), nombre, tipo, edad, id_cliente },
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
}

export async function deleteMascotaHandler(req, res) {
  try {
    const { id } = req.params;
    const affectedRows = await deleteMascota(id);

    if (affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Mascota no encontrada" });
    }

    return res.status(200).json({ ok: true, message: "Mascota eliminada" });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
}
