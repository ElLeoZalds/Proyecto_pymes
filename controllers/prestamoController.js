const db = require("../config/db");

exports.crearPrestamo = async (req, res) => {
  try {
    const {
      prestamo,
      caracteristicas,
      fechalimite,
      montototal,
      estado,
      interes,
      cliente,
    } = req.body;

    // Validar si el cliente tiene un préstamo vigente
    const [existe] = await db.query(
      "SELECT id FROM prestamos WHERE cliente = ? AND estado = 'vigente'",
      [cliente]
    );

    if (existe.length > 0) {
      return res.status(400).json({
        mensaje:
          "El cliente ya tiene un préstamo vigente. No puede registrar otro hasta finalizarlo.",
      });
    }

    const letracambio = req.files?.letracambio
      ? `/uploads/${req.files.letracambio[0].filename}`
      : null;

    const transferencia = req.files?.transferencia
      ? `/uploads/${req.files.transferencia[0].filename}`
      : null;

    const [result] = await db.query(
      "INSERT INTO prestamos (prestamo, caracteristicas, letracambio, fechalimite, transferencia, montototal, estado, interes, cliente) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        prestamo,
        caracteristicas,
        letracambio,
        fechalimite,
        transferencia,
        montototal,
        estado,
        interes,
        cliente,
      ]
    );

    res.status(201).json({
      id: result.insertId,
      message: "Registro Correcto",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: "Error en el proceso de registro" });
  }
};

exports.obtenerPrestamo = async (req, res) => {
  const sql =
    "SELECT id, prestamo, caracteristicas, letracambio, fechainicio, fechalimite, transferencia, montototal, estado, interes, cliente FROM prestamos";
  try {
    const [prestamos] = await db.query(sql);
    res.status(200).json(prestamos);
  } catch (e) {
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

exports.obtenerPrestamoPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const [prestamo] = await db.query("SELECT * FROM prestamos WHERE id = ?", [
      id,
    ]);
    if (prestamo.length === 0)
      return res.status(404).json({ mensaje: "Préstamo no encontrado" });
    res.status(200).json(prestamo[0]);
  } catch (e) {
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

exports.actualizarPrestamo = async (req, res) => {
  const { id } = req.params;
  const {
    prestamo,
    caracteristicas,
    fechalimite,
    montototal,
    estado,
    interes,
    cliente,
  } = req.body;

  const letracambio = req.files?.letracambio
    ? `/uploads/${req.files.letracambio[0].filename}`
    : req.body.letracambio || null;

  const transferencia = req.files?.transferencia
    ? `/uploads/${req.files.transferencia[0].filename}`
    : req.body.transferencia || null;

  const sql = `UPDATE prestamos SET prestamo=?, caracteristicas=?, letracambio=?, fechalimite=?, transferencia=?, montototal=?, estado=?, interes=?, cliente=? WHERE id=?`;

  try {
    await db.query(sql, [
      prestamo,
      caracteristicas,
      letracambio,
      fechalimite,
      transferencia,
      montototal,
      estado,
      interes,
      cliente,
      id,
    ]);
    res.status(200).json({ mensaje: "Actualizado correctamente" });
  } catch (e) {
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

exports.eliminarPrestamo = async (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM prestamos WHERE id = ?";
  try {
    const [result] = await db.query(sql, [id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ mensaje: "Préstamo no encontrado" });
    res.status(200).json({ mensaje: "Eliminado correctamente" });
  } catch (e) {
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};
