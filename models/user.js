const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// Création du modèle user
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// vérification des emails(doivent être uniques)
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
