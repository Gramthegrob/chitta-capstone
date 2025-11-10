// node-api/middlewares/errorHandler.js
function notFound(_req, res, _next) {
  res.status(404).json({ message: "Not Found" });
}

function errorHandler(err, _req, res, _next) {
  console.error("❌", err);
  const code = err.status || 500;
  res.status(code).json({
    message: err.message || "Internal Server Error",
  });
}

module.exports = { notFound, errorHandler };
