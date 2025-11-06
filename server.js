const express = require("express");

const cors = require("cors");
const path = require("path");

const clienteRoutes = require("./routes/clienteRoutes");
const prestamoRoutes = require("./routes/prestamoRoutes");
const pagoRoutes = require("./routes/pagoRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Servidor escuchando
app.use(
  cors({
    origin: "*",
    methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/clientes", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "clientes.html"));
});
app.get("/prestamos", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "prestamos.html"));
});
app.get("/pagos", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pagos.html"));
});

app.use(express.json());

app.use("/api/clientes", clienteRoutes);
app.use("/api/prestamos", prestamoRoutes);
app.use("/api/pagos", pagoRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
