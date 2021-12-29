const express = require("express");
const router = express.Router();
const sauceController = require("../controllers/sauces");
const auth = require("../middleware/auth");
const multer = require("../middleware/upload");

router.get("/", auth, sauceController.getAllSauces);
router.get("/:id", auth, sauceController.getOneSauce);
router.post("/", auth, multer, sauceController.createSauce);
router.put("/:id", auth, multer, sauceController.modifySauce);
router.delete("/:id", auth, sauceController.deleteSauce);
router.post("/:id/like", auth, sauceController.likeSystem);

module.exports = router;
