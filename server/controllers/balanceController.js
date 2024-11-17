const { erc20ABI } = require("../core/erc20ABI.js");
const { Web3 } = require("web3");

const web3 = new Web3(process.env.INFURA_CONNECTION_STRING);

const getBalance = async (req, res) => {
  const { contractAddress, walletAddress } = req.query;

  if (!contractAddress || !walletAddress) {
    return res
      .status(400)
      .json({ error: "Contract address and wallet address are required" });
  }

  try {
    const tokenContract = new web3.eth.Contract(erc20ABI, contractAddress);

    const balance = await tokenContract.methods.balanceOf(walletAddress).call();

    const decimals = await tokenContract.methods.decimals().call();
    const formattedBalance = Number(balance) / Math.pow(10, Number(decimals));

    return res.status(200).json({
      contractAddress,
      walletAddress,
      balance: formattedBalance,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error fetching token balance" });
  }
};

module.exports = { getBalance };
