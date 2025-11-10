// node-api/config/env.js
module.exports = {
  PORT: process.env.PORT || 8080,

  PG: {
    host: process.env.PGHOST,
    port: +(process.env.PGPORT || 5432),
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
  },

  JWT: {
    secret: process.env.JWT_SECRET || "supersecret",
    expiresIn: process.env.JWT_EXPIRES || "12h",
  },

  PY: {
    screeningBase: process.env.PY_SCREENING_BASE || "http://127.0.0.1:8001",
    monitoringBase: process.env.PY_MONITORING_BASE || "http://127.0.0.1:8002",
  },
};
