const express = require("express");
const router = express.Router();
const sauceController = require("../controllers/sauces");
const authorize = require("../middleware/auth");
const multer = require("../middleware/upload");

router.post("/", authorize, multer, sauceController.createSauce);
router.get("/", authorize, sauceController.getAllSauces);
router.get("/:id", authorize, sauceController.getOneSauce);
router.put("/:id", authorize, multer, sauceController.modifySauce);
router.delete("/:id", authorize, sauceController.deleteSauce);

module.exports = router;
