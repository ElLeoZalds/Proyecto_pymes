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
