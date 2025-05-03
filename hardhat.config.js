require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.23",
  networks: {
    holesky: {
      url: process.env.API_URL || "https://ethereum-holesky-rpc.publicnode.com",
      accounts: [process.env.VENN_PRIVATE_KEY || process.env.PRIVATE_KEY],
      chainId: 17000,
      gas: 3000000
    }
  }
};