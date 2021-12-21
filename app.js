const express = require("express");

// Config variables d'environnement
const dotEnv = require("dotenv").config({ path: "./config/.env" });
const mongoose = require("mongoose");
const app = express();

const userRoutes = require("./routes/user");

// Connexion à la  BDD
mongoose
  .connect(
    "mongodb+srv://" +
      process.env.DB_USER_PASS +
      "@cluster0.ivh58.mongodb.net/p6-OC?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(express.json());

// Appel des différents routers
app.use("/api/auth", userRoutes);

module.exports = app;
