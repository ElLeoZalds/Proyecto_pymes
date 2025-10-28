const db = require("../config/db");

exports.crearClientes = async (req, res) => {
  const { nombres, apellidos, dni, telefono } = req.body;

  if (!nombres || !apellidos || !dni || !telefono) {
    return res.status(201).json({ mensaje: "Falta completar los campos" });
  }

  const sql =
    "INSERT INTO clientes (nombres, apellidos, dni, telefono VALUES (?, ?, ?, ?)";

  try {
    const [result] = await db.query(sql, [nombres, apellidos, dni, telefono]);

    res
      .status(201)
      .json({ id: result.insertId, mensaje: "Registrado correctamente" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

exports.obtenerCliente = async (req, res) => {
  const sql = "SELECT id, nombres, apellidos, dni, telefono FROM clientes";

  try {
    const [clientes] = await db.query(sql);
    res.status(200).json(clientes);
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

exports.obtenerClientePorId = async (req, res) => {
  const { id } = req.params;

  const sql =
    "SELECT id, nombres, apellidos, dni, telefono FROM clientes WHERE id = ?";

  try {
    const [clientes] = await db.query(sql, [id]);

    if (clientes.length === 0) {
      return res.status(404).json({ mensaje: "Categoria no encontrada" });
    }

    res.status(200).json(clientes[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

exports.actualizarCliente = async (req, res) => {
  const { id } = req.params;
  const { nombres, apellidos, dni, telefono } = req.body;

  if (!nombres && !apellidos && !dni && !telefono) {
    return res.status(201).json({ mensaje: "Falta completar los campos" });
  }

  let sqlParts = [];
  let values = [];

  if (nombres) {
    sqlParts.push("nombres = ?");
    values.push(nombres);
  }

  if (apellidos) {
    sqlParts.push("apellidos = ?");
    values.push(apellidos);
  }

  if (dni) {
    sqlParts.push("dni = ?");
    values.push(dni);
  }

  if (telefono) {
    sqlParts.push("telefono = ?");
    values.push(telefono);
  }

  if (sqlParts.length === 0) {
    return res.status(400).json({ mensaje: "No hay campos por actualizar" });
  }

  values.push(id);
  const sql = `UPDATE clientes SET ${sqlParts.join(", ")} WHERE id = ?`;

  try {
    const [result] = await db.query(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Cliente no encontrado" });
    }
    res.status(200).json({ mensaje: "Cliente actualizado correctamente" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

exports.eliminarCliente = async (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM clientes WHERE id = ?";

  try {
    const [result] = await db.query(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Cliente no encontrado" });
    }

    res.status(200).json({ mensaje: "Cliente eliminado correctamente" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};
