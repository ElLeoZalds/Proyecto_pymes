const db = require("../config/db");

exports.crearPrestamo = async (req, res) => {
  const { cuota, fechapago, prestamo } = req.body;

  if (!cuota || !fechapago || !prestamo) {
    return res.status(201).json({ mensaje: "Falta completar los campos" });
  }

  const sql = "INSERT INTO pagos (cuota, fechapago, prestamo) VALUES (?, ?, ?)";

  try {
    const [result] = await db.query(sql, [cuota, fechapago, prestamo]);
    res
      .status(201)
      .json({ id: result.insertId, mensaje: "Registrado correctamente" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

exports.obtenerPagos = async (req, res) => {
  const sql = "SELECT id, cuota, fechapago, prestamo FROM pagos";
  try {
    const [pagos] = await db.query(sql);
    res.status(200).json(pagos);
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

exports.obtenerPagoPorId = async (req, res) => {
  const { id } = req.params;

  const sql = "SELECT id, cuota, fechapago, prestamo FROM pagos WHERE id = ?";

  try {
    const [pagos] = await db.query(sql, [id]);
    if (pagos.length === 0) {
      return res.status(404).json({ mensaje: "Pago no encontrado" });
    }
    res.status(200).json(pagos[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

exports.actualizarPago = async (req, res) => {
  const { id } = req.params;
  const { cuota, fechapago, prestamo } = req.body;

  const sql =
    "UPDATE pagos SET cuota = ?, fechapago = ?, prestamo = ? WHERE id = ?";

  try {
    const [result] = await db.query(sql, [cuota, fechapago, prestamo, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Pago no encontrado" });
    }
    res.status(200).json({ mensaje: "Pago actualizado correctamente" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

exports.eliminarPago = async (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM pagos WHERE id = ?";

  try {
    const [result] = await db.query(sql, [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Pago no encontrado" });
    }
    res.status(200).json({ mensaje: "Pago eliminado correctamente" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

