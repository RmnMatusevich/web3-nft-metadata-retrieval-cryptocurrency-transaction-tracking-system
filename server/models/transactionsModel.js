const mongoose = require("mongoose");
const { Schema } = mongoose;

const TransactionsSchema = new Schema({
  id: {
    type: mongoose.Types.ObjectId,
    required: true,
    unique: true,
    auto: true
  },
  hash: {
    type: String,
    required: true,
    unique: true
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  blockNumber: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
  addressId: {
    type: Schema.Types.String,
    ref: "Address",
    required: true,
  },
});

module.exports = mongoose.model("Transactions", TransactionsSchema);
