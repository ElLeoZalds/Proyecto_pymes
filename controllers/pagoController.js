const db = require("../config/db");

exports.crearPago = async (req, res) => {
  const { cuota, prestamo } = req.body;

  if (!cuota || !prestamo) {
    return res.status(400).json({ mensaje: "Falta completar los campos" });
  }

  try {
    const insertSql = "INSERT INTO pagos (cuota, prestamo) VALUES (?, ?)";
    const [result] = await db.query(insertSql, [cuota, prestamo]);

    const selectSql = "SELECT montototal, montorestante FROM prestamos WHERE id = ?";
    const [rows] = await db.query(selectSql, [prestamo]);

    if (rows.length === 0) {
      return res.status(404).json({ mensaje: "Préstamo no encontrado" });
    }

    const { montototal, montorestante } = rows[0];
    let restanteBase = parseFloat(montorestante) === 0 ? parseFloat(montototal) : parseFloat(montorestante);
    let nuevoRestante = restanteBase - parseFloat(cuota);
    if (nuevoRestante < 0) nuevoRestante = 0;

    const updateSql = "UPDATE prestamos SET montorestante = ? WHERE id = ?";
    await db.query(updateSql, [nuevoRestante, prestamo]);

    res.status(201).json({
      mensaje: "Pago registrado y monto restante actualizado",
      idpago: result.insertId,
      montorestante: nuevoRestante,
    });
  } catch (e) {
    console.error("Error en crearPago:", e);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

exports.obtenerPago = async (req, res) => {
  const sql = `
    SELECT 
      pag.id, 
      pag.cuota, 
      pag.fechapago, 
      pre.prestamo, 
      pre.montorestante, 
      cli.nombres 
    FROM pagos pag 
    INNER JOIN prestamos pre ON pag.prestamo = pre.id 
    INNER JOIN clientes cli ON pre.cliente = cli.id
    ORDER BY pag.id DESC
  `;
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
  const sql = "SELECT id, cuota, prestamo FROM pagos WHERE id = ?";
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
  const { cuota, prestamo } = req.body;
  const sql = "UPDATE pagos SET cuota = ?, prestamo = ? WHERE id = ?";
  try {
    const [result] = await db.query(sql, [cuota, prestamo, id]);
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
