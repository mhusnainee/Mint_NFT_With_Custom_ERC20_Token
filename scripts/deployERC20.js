const hre = require("hardhat");

async function main() {
  const contractFactory = await hre.ethers.getContractFactory("MYERC20");
  const erc20 = await contractFactory.deploy();

  await erc20.deployed();

  console.log(`ERC20 Contract deployed to ${erc20.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
