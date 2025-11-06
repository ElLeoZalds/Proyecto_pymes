const express = require("express");
const router = express.Router();

const prestamoController = require("../controllers/prestamoController");

router.post("/", prestamoController.crearPrestamo);
router.get("/", prestamoController.obtenerPrestamo);
router.get("/:id", prestamoController.obtenerPrestamoPorId);
router.put("/:id", prestamoController.actualizarPrestamo);
router.delete("/:id", prestamoController.eliminarPrestamo);

module.exports = router;
