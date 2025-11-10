// node-api/app.js
require('dotenv').config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const { PORT } = require("./config/env");

// routes
const authRoutes = require("./routes/authRoutes");
const jurnalHarianRoutes = require("./routes/jurnalHarianRoutes");
const screeningRoutes = require("./routes/screeningRoutes");
const monitoringRoutes = require("./routes/monitoringRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const konsultasiRoutes = require("./routes/konsultasiRoutes");

// middlewares
const { errorHandler, notFound } = require("./middlewares/errorHandler");

const app = express();

// security & body
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGINS?.split(",") || "*" }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

// health
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// mount routes
app.use("/api/auth", authRoutes);
app.use("/api/jurnal", jurnalHarianRoutes);
app.use("/api/screening", screeningRoutes);
app.use("/api/monitoring", monitoringRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/konsultasi", konsultasiRoutes);

// 404 + error
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ node-api running on :${PORT}`);
});