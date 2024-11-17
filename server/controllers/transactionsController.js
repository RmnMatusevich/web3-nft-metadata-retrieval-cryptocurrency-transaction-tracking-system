const TransactionsSchema = require("../models/transactionsModel.js");
const AddressSchema = require("../models/addressModel.js");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const ETHERSCAN_API = process.env.ETHERSCAN_API;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

const storeTransactions = async (req, res) => {
  try {
    const address = req.params.address;
    const response = await axios.get(ETHERSCAN_API, {
      params: {
        module: "account",
        action: "txlist",
        address,
        startblock: 0,
        endblock: 99999999,
        sort: "desc",
        apiKey: ETHERSCAN_API_KEY,
      },
    });
    let transactionsToSave = response.data.result;

    const dbAddress = await AddressSchema.findOne({ address }).then((doc) => {
      if (!doc) {
        return AddressSchema.create({ address });
      }
      return doc;
    });
    await TransactionsSchema.insertMany(
      transactionsToSave?.map((tx) => ({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: tx.value,
        blockNumber: tx.blockNumber,
        timestamp: new Date(tx.timeStamp * 1000),
        addressId: dbAddress.address,
      }))
    );

    res.json(transactionsToSave.slice(0, 5));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getTransactions = async (req, res) => {
  const address = req.params.address;

  const { startDate, endDate } = req.query;
  const filters = {
    addressId: address,
  };

  if (startDate) {
    filters.timestamp = { ...filters.timestamp, $gte: new Date(startDate) };
  }

  if (endDate) {
    filters.timestamp = { ...filters.timestamp, $lte: new Date(endDate) };
  }

  try {
    const transactions = await TransactionsSchema.find(filters);

    res.status(200).json(transactions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { storeTransactions, getTransactions };
