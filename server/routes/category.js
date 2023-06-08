let express = require("express");
let router = express.Router();
const { getAllCategory, createNewCategory } = require("../controllers/categoryController");

//1.GET ALL CATEGORY
router.get("/all", getAllCategory);

//2.CREATE NEW CATEGORY
router.post("/create", createNewCategory);

module.exports = router;