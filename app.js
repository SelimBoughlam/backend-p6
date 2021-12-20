const express = require("express");
const dotEnv = require("dotenv").config({ path: "./config/.env" });
const mongoose = require("mongoose");

const app = express();

mongoose
  .connect(
    "mongodb+srv://" +
      process.env.DB_USER_PASS +
      "@cluster0.ivh58.mongodb.net/p6-OC?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use((req, res) => {
  res.json({ message: "requete réussie" });
});

module.exports = app;
