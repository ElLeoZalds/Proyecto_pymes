const express = require("express");
const router = express.Router();

const clienteController = require("../controllers/clienteController");

router.post("/", clienteController.crearClientes);
router.get("/", clienteController.obtenerCliente);
router.get("/:id", clienteController.obtenerClientePorId);
router.put("/:id", clienteController.actualizarCliente);
router.delete("/:id", clienteController.eliminarCliente);

module.exports = router;
