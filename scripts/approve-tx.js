require("dotenv").config();
const { VennClient } = require("@vennbuild/venn-dapp-sdk");
const hre = require("hardhat");

async function main() {
  // Initialize VennClient
  const vennURL = process.env.VENN_NODE_URL;
  const vennPolicyAddress = process.env.VENN_POLICY_ADDRESS;
  const vennClient = new VennClient({ vennURL, vennPolicyAddress });

  // Get contract instance
  const contractAddress = require("../contract-address.json").address;
  const Rare = await hre.ethers.getContractFactory("Rare");
  const contract = await Rare.attach(contractAddress);

  // Prepare transaction
  const [sender] = await hre.ethers.getSigners();
  const tx = {
    from: sender.address,
    to: contractAddress,
    data: contract.interface.encodeFunctionData("myMethod"),
    value: "0",
    chainId: 17000 
  };

  // Approve transaction with Venn
  const approvedTransaction = await vennClient.approve(tx);
  console.log("Approved transaction:", approvedTransaction);

  // Send the approved transaction
  const receipt = await sender.sendTransaction(approvedTransaction);
  console.log("Transaction receipt:", receipt);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});