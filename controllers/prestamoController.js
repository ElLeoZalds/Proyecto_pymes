const db = require("../config/db");

exports.crearPrestamo = async (req, res) => {
  const {
    prestamo,
    caracteristicas,
    letracambio,
    fechainicio,
    fechalimite,
    transparencia,
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
    !interes ||
    !cliente
  ) {
    return res.status(201).json({ mensaje: "Falta completar los campos" });
  }

  const sql =
    "INSERT INTO prestamos (prestamo, caracteristicas, letracambio, fechainicio, fechalimite, transferencia, interes, cliente) VALUES (?, ?, ?, ?, ?, ?, ?, ?";

  try {
    const [result] = await db.query(sql, [
      prestamo,
      caracteristicas,
      letracambio,
      fechainicio,
      fechalimite,
      transferencia,
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
  const sql = "SELECT "
};

