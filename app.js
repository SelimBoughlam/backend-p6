const express = require("express");

// Config variables d'environnement
const dotEnv = require("dotenv").config();
const mongoose = require("mongoose");
const app = express();

const userRoutes = require("./routes/user");
const saucesRoutes = require("./routes/sauces");
const path = require("path");
app.use(express.json());

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

// création des CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

//ajout du chemin statique du dossier images
app.use("/images", express.static(path.join(__dirname, "images")));

// Appel des différents routers
app.use("/api/sauces", saucesRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;
