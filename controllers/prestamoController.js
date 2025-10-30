const db = require("../config/db");

exports.crearPrestamo = async (req, res) => {
  const {
    prestamo,
    caracteristicas,
    letracambio,
    fechainicio,
    fechalimite,
    transferencia,
    montototal,
    estado,
    interes,
    cliente,
  } = req.body;

  if (
    !prestamo ||
    !caracteristicas ||
    !letracambio ||
    !fechainicio ||
    !fechalimite ||
    !transferencia ||
    !montototal ||
    !estado ||
    !interes ||
    !cliente
  ) {
    return res.status(201).json({ mensaje: "Falta completar los campos" });
  }

  const sql =
    "INSERT INTO prestamos (prestamo, caracteristicas, letracambio, fechainicio, fechalimite, transferencia, montototal, estado, interes, cliente) VALUES (?, ?, ?, ?, ?, ?, ?, ?";

  try {
    const [result] = await db.query(sql, [
      prestamo,
      caracteristicas,
      letracambio,
      fechainicio,
      fechalimite,
      transferencia,
      montototal,
      estado,
      interes,
      cliente,
    ]);

    res
      .status(201)
      .json({ id: result.insertId, mensaje: "Registrado correctamente" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

exports.obtenerPrestamo = async (req, res) => {
  const sql =
    "SELECT id, prestamo, caracteristicas, letracambio, fechainicio, fechalimite, transferencia, montototal, estado, interes, cliente FROM prestamos";

  try {
    const [prestamos] = await db.query(sql);
    res.status(200).json(prestamos);
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

exports.obtenerPrestamoPorId = async (req, res) => {
  const { id } = req.params;

  const sql =
    "SELECT id, prestamo, caracteristicas, letracambio, fechainicio, fechalimite, transferencia, montototal, estado, interes, cliente FROM prestamos WHERE id = ?";
  try {
    const [prestamos] = await db.query(sql, [id]);
    if (prestamos.length === 0) {
      return res.status(404).json({ mensaje: "Categoria no encontrada" });
    }
    res.status(200).json(prestamos[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

exports.actualizarPrestamo = async (req, res) => {
  const { id } = req.params;
  const {
    prestamo,
    caracteristicas,
    letracambio,
    fechainicio,
    fechalimite,
    transferencia,
    montototal,
    estado,
    interes,
    cliente,
  } = req.body;

  if (
    !prestamo &&
    !caracteristicas &&
    !letracambio &&
    !fechainicio &&
    !fechalimite &&
    !transferencia &&
    !montototal &&
    !estado &&
    !interes &&
    !cliente
  ) {
    return res.status(201).json({ mensaje: "Falta completar los campos" });
  }

  let sqlParts = [];
  let values = [];

  if (prestamo) {
    sqlParts.push("prestamo = ?");
    values.push(prestamo);
  }

  if (caracteristicas) {
    sqlParts.push("caracteristicas = ?");
    values.push(caracteristicas);
  }

  if (letracambio) {
    sqlParts.push("letracambio = ?");
    values.push(letracambio);
  }

  if (fechainicio) {
    sqlParts.push("fechainicio = ?");
    values.push(fechainicio);
  }

  if (fechalimite) {
    sqlParts.push("fechalimite = ?");
    values.push(fechalimite);
  }

  if (transferencia) {
    sqlParts.push("transferencia = ?");
    values.push(transferencia);
  }

  if (montototal) {
    sqlParts.push("montototal = ?");
    values.push(montototal);
  }

  if (estado) {
    sqlParts.push("estado = ?");
    values.push(estado);
  }

  if (interes) {
    sqlParts.push("interes = ?");
    values.push(interes);
  }

  if (cliente) {
    sqlParts.push("cliente = ?");
    values.push(cliente);
  }

  const sql = `UPDATE prestamos SET ${sqlParts.join(", ")} WHERE id = ?`;
  values.push(id);

  try {
    const [result] = await db.query(sql, values);
    res.status(200).json({ mensaje: "Actualizado correctamente" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

exports.eliminarPrestamo = async (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM prestamos WHERE id = ?";

  try {
    const [result] = await db.query(sql, [id]);
    res.status(200).json({ mensaje: "Eliminado correctamente" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

