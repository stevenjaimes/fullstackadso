import { createCliente, getClientes } from "../repositories/clientes.repository.js";

export async function getClientesHandler(_req, res) {
  try {
    const rows = await getClientes();
    return res.status(200).json({ ok: true, data: rows });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
}

export async function createClienteHandler(req, res) {
  try {
    const { nombre, telefono, email } = req.body;

    if (!nombre) {
      return res.status(400).json({
        ok: false,
        message: "Campo requerido: nombre",
      });
    }

    const id_cliente = await createCliente({ nombre, telefono, email });

    return res.status(201).json({
      ok: true,
      message: "Dueno registrado",
      data: { id_cliente, nombre, telefono: telefono || null, email: email || null },
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
}
