const mongoose = require("mongoose");
const { Schema } = mongoose;

const NftSchema = new Schema(
  {
    id: {
      type: mongoose.Types.ObjectId,
      required: true,
      unique: true,
      auto: true,
    },
    contractAddress: {
      type: String,
      required: true,
    },
    tokenId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Nft", NftSchema);
