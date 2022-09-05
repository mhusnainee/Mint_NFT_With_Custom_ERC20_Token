const hre = require("hardhat");

const erc20ContractAddress = process.env.ERC20_CONTRACT_ADDRESS;

async function main() {
  const contractFactory = await hre.ethers.getContractFactory("MYERC721");
  const erc721 = await contractFactory.deploy(erc20ContractAddress);

  await erc721.deployed();

  console.log(`ERC721 Contract deployed to ${erc721.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
