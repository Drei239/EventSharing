let express = require("express");
let router = express.Router();
const { createNewEvent } = require("../controllers/eventController");

//1.CREATE NEW EVENT
router.post("/create", createNewEvent);

module.exports = router;