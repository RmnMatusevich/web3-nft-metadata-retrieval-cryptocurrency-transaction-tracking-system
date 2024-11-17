const mongoose = require("mongoose");
const { Schema } = mongoose;

const AddressSchema = new Schema({
  address: {
    type: String,
    index: true,
    required: true,
  },
  transactions: [
    {
      type: Schema.Types.String,
      ref: "Transactions",
    },
  ],
});

module.exports = mongoose.model("Address", AddressSchema);
