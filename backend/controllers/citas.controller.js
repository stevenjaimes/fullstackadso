import { createCita, deleteCita, getCitas } from "../repositories/citas.repository.js";

export async function createCitaHandler(req, res) {
  try {
    const { id_mascota, fecha, hora } = req.body;

    if (!id_mascota || !fecha || !hora) {
      return res.status(400).json({
        ok: false,
        message: "Campos requeridos: id_mascota, fecha, hora",
      });
    }

    const id_cita = await createCita({ id_mascota, fecha, hora });

    return res.status(201).json({
      ok: true,
      message: "Cita registrada",
      data: { id_cita, id_mascota, fecha, hora },
    });
  } catch (error) {
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({
        ok: false,
        message: "La mascota seleccionada no existe",
      });
    }

    return res.status(500).json({ ok: false, message: error.message });
  }
}

export async function getCitasHandler(_req, res) {
  try {
    const rows = await getCitas();
    return res.status(200).json({ ok: true, data: rows });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
}

export async function deleteCitaHandler(req, res) {
  try {
    const { id } = req.params;
    const affectedRows = await deleteCita(id);

    if (affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Cita no encontrada" });
    }

    return res.status(200).json({ ok: true, message: "Cita eliminada" });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
}
