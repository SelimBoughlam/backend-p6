//Import du package Multer(gestionnaire de téléchargement)
const multer = require("multer");

/**
 * Fonction d'enregistrement des images dans le dossier images
 * gestion du nom du fichier
 */
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + "--" + file.originalname);
  },
});

/**
 * Fonction de gestion de l'extension des fichiers images
 * @param {*} req
 * @param {*} file
 * @param {*} cb
 */
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.includes("jpeg") ||
    file.mimetype.includes("png") ||
    file.mimetype.includes("jpg")
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

module.exports = multer({ storage }).single("image");
