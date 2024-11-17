const express = require("express");
const { getNft } = require("../controllers/nftController.js");

const router = express.Router();

router.get("/", getNft);

module.exports = router;
