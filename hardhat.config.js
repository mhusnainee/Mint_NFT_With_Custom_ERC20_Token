require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const rinkebyRpcURL = process.env.RINKEBY_RPC_URL;
const privateKeyerc20 = process.env.PRIVATE_KEY_ERC20;
const privateKeyerc2721 = process.env.PRIVATE_KEY_ERC721;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    rinkebyForERC20 : {
      url: rinkebyRpcURL,
      accounts: [privateKeyerc20],
      chainId: 4,
    },

    rinkebyForERC721 : {
      url: rinkebyRpcURL,
      accounts: [privateKeyerc2721],
      chainId: 4,
    },
  },
  solidity: "0.8.9",
};
