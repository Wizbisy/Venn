async function main() {
    const Rare = await ethers.getContractFactory("Rare");
    const contract = await Rare.deploy();
    await contract.waitForDeployment();
  
    console.log("Deployed to:", await contract.getAddress());
    require("fs").writeFileSync("contract-address.json", JSON.stringify({ address: await contract.getAddress() }));
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });