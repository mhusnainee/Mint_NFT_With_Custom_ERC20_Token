const ethers = require("ethers");

const API_URL = process.env.INFURA_API_KEY;
const privateKeyERC20 = process.env.PRIVATE_KEY_ERC20;
const privateKeyERC721 = process.env.PRIVATE_KEY_ERC721;
const ERC20contractAddress = process.env.ERC20_CONTRACT_ADDRESS;
const ERC721contractAddress = process.env.ERC721_CONTRACT_ADDRESS;
const nftUri = process.env.NFT_URI;
const ERC20_CONTRACT_ABI = require("../artifacts/contracts/ERC20.sol/MYERC20.json");
const ERC721_CONTRACT_ABI = require("../artifacts/contracts/ERC721.sol/MYERC721.json");

let customHttpProvider = new ethers.providers.JsonRpcProvider(API_URL);



async function buyNFT(uri) {
  let erc20wallet = new ethers.Wallet(privateKeyERC20, customHttpProvider);
  let erc721wallet = new ethers.Wallet(privateKeyERC20, customHttpProvider);

  let erc20signer = new ethers.Contract(ERC20contractAddress, ERC20_CONTRACT_ABI.abi, erc20wallet);
  let erc721signer = new ethers.Contract(ERC721contractAddress, ERC721_CONTRACT_ABI.abi, erc721wallet);

  const approve = await erc20signer.approve(ERC721contractAddress, BigInt(500000000000000000));
  console.log("Approved ERC721 contract by amount 500000000000000000");
  console.log(approve);

  const buy = await erc721signer.safeMint(uri);
  console.log("NFT successfully bought");
  console.log(buy);
}

buyNFT(nftUri);