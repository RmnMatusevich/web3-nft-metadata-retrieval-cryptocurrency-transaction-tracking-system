const express = require("express");
const {
  storeTransactions,
  getTransactions,
} = require("../controllers/transactionsController.js");

const router = express.Router();

router.post("/:address", storeTransactions);

router.get("/:address", getTransactions);

module.exports = router;
