const express = require("express");
const router = express.Router();

const prestamoController = require("../controllers/prestamoController");
const upload = require("../middleware");

router.post(
  "/",
  upload.fields([
    { name: "letracambio", maxCount: 1 },
    { name: "transferencia", maxCount: 1 }
  ]),
  prestamoController.crearPrestamo
);

router.get("/", prestamoController.obtenerPrestamo);
router.get("/:id", prestamoController.obtenerPrestamoPorId);

router.put(
  "/:id",
  upload.fields([
    { name: "letracambio", maxCount: 1 },
    { name: "transferencia", maxCount: 1 }
  ]),
  prestamoController.actualizarPrestamo
);

router.delete("/:id", prestamoController.eliminarPrestamo);

module.exports = router;
