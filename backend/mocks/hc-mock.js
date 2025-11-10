const express = require("express");
const app = express();
app.use(express.json());

// auth minimal
app.use((req, res, next) => {
  const ok = (req.headers.authorization || "").startsWith("Bearer ");
  if (!ok) return res.status(401).json({ error: "No bearer token" });
  next();
});

// HR
app.get("/v2/heart-rate", (req, res) => {
  const now = Date.now();
  const items = Array.from({ length: 12 }).map((_, i) => ({
    _id: `hr_${i}`,
    start: new Date(now - (i+1)*5*60*1000).toISOString(), // tiap 5 menit
    bpm: 60 + Math.floor(Math.random()*50),
    app: "mock.healthconnect"
  }));
  res.json({ items });
});

// Sleep
app.get("/v2/sleep-session", (req, res) => {
  const end = new Date().toISOString();
  const start = new Date(Date.now() - 6*60*60*1000).toISOString(); // 6 jam
  res.json({
    items: [{ _id: "sleep_1", start, end, app: "mock.healthconnect" }]
  });
});

app.listen(6644, () => console.log("HC Mock on http://localhost:6644"));
