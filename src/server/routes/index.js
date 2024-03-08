//routes/index.js
const express = require("express");
const router = express.Router();
const dataRoute = require("./saveData");

router.use("/data", dataRoute);

module.exports = router;
