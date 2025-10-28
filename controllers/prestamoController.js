const db = require("../config/db");

exports.crearPrestamo = async (req, res) => {
  const {
    prestamo,
    caracteristicas,
    letracambio,
    fechainicio,
    fechalimite,
    transperencia,
    interes,
    cliente,
  } = req.body;

  if (
    !prestamo ||
    !caracteristicas ||
    !letracambio ||
    !fechainicio ||
    !fechalimite ||
    !transperencia ||
    !interes ||
    !cliente
  ) {
    return res.status(201).json({ mensaje: "Falta completar los campos" });
  }
};
