// const mongoose = require("mongoose");

const { Web3 } = require("web3");
const axios = require("axios");
const NftSchema = require("../models/nftModel.js");
const { nftABI } = require("../core/nftABI.js");

const web3 = new Web3(process.env.INFURA_CONNECTION_STRING);

const getNft = async (req, res) => {
  try {
    const { contractAddress, tokenId } = req.query;

    if (!web3.utils.isAddress(contractAddress)) {
      return res.status(400).json({ error: "Invalid Ethereum address" });
    }

    const contract = new web3.eth.Contract(nftABI, contractAddress);

    const tokenURI = await contract.methods.tokenURI(tokenId).call();

    if (!tokenURI) {
      return res.status(404).json({ error: "Token URI not found" });
    }

    const ipfsUrlToHttp = (url) => {
      if (url.startsWith("ipfs://")) {
        return url.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");
      }
      return url;
    };

    const httpTokenURI = ipfsUrlToHttp(tokenURI);

    const response = await axios.get(httpTokenURI);
    const metadata = response.data;

    const dbNft = await NftSchema.create({
      contractAddress,
      tokenId,
      name: metadata.name,
      description: metadata.description,
      imageUrl: httpTokenURI,
    });
    const nftResponse = {
      contractAddress: dbNft.contractAddress,
      tokenId: dbNft.tokenId,
      imageUrl: dbNft.imageUrl,
      metadata,
    };
    return res.status(200).json(nftResponse);
  } catch (error) {
    console.error("Error fetching NFT metadata:", error);

    if (error.cause) {
      console.error("Cause:", error.cause);
      return res.status(500).json({
        error: "Contract execution failed",
        cause: error.cause.message,
      });
    }

    return res.status(400).json({ error: error.message });
  }
};

module.exports = { getNft };
