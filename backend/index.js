const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Route
const pazientiRoute = require("./routes/pazienti");
const sanitariRoute = require("./routes/sanitari");
const specialisticheRoute = require("./routes/specialistiche");
const verificaSanitarioRoute = require("./routes/albo_sanitari");
const appuntamentiRoute = require("./routes/appuntamenti");
const pazientiSanitariRoute = require("./routes/pazienti_sanitari");
const recensioniRoute = require("./routes/recensioni");
const domandeRoute = require("./routes/domande");
const notificheRoute = require("./routes/notifiche");
const ricercaRoute = require("./routes/ricerca");


// Monta le route
app.use("/api/pazienti", pazientiRoute);
app.use("/api/sanitari", sanitariRoute);
app.use("/api/specialistiche", specialisticheRoute);
app.use("/api/verifica-sanitario", verificaSanitarioRoute);
app.use("/api/appuntamenti", appuntamentiRoute);
app.use("/api/elenco-pazienti", pazientiSanitariRoute);
app.use("/api/recensioni", recensioniRoute);
app.use("/api/domande", domandeRoute);
app.use("/api/notifiche", notificheRoute);
app.use("/api/ricerca", ricercaRoute);

// Route di test
app.get("/", (req, res) => {
  res.send("✅ Backend Express attivo");
});

// Avvia server
app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});
