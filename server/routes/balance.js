const express = require("express");
const { getBalance } = require("../controllers/balanceController.js");

const router = express.Router();

router.get("/", getBalance);

module.exports = router;
