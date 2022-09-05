# Mint_NFT_With_Custom_ERC20_Token
## Step by step guide
## Setting up project in Visual Studio Code

Create a new folder and open this folder in visual studio code

Open terminal and enter this command

```npm init -y```

Now install hardhat with following command

```npm install hardhat```

Now install hardhat tools by following command

```npm install "@nomicfoundation/hardhat-toolbox"```

Now install dotenv with following command

``` npm install dotenv```

Now install ethers library with this command

``` npm install ethers```

Our project is ready for coding

Now run the folloing command and select ```create a simple hardhat project ``` to create a hardhat project

``` npx hardhat```

 ### Let's Code
 
 ## ERC20 Contract
 
 Create a file named ```ERC20.sol``` in contracts folder and paste the following code in it
 
 ```bash
 // SPDX-License-Identifier: MIT
pragma solidity >= 0.7.0 < 0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MYERC20 is ERC20 {
    constructor() ERC20("IECToken", "IECT") {
        _mint(msg.sender, 1000 * 10 ** decimals());
    }
}
```

## ERC721 Contract

Now create and other file named ```ERC721.sol``` in the cotracts folder and paste the following code in it

```bash
// SPDX-License-Identifier: MIT
pragma solidity >= 0.7.0 < 0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract MYERC721 is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    IERC20 public tokenAddress;
    uint256 public price = 0.5 * 10 ** 18;

    Counters.Counter private _tokenIdCounter;

    constructor(address _tokenAddress) ERC721("NFTBUY", "NFTB") {
        tokenAddress = IERC20(_tokenAddress);
    }

    function safeMint(string memory _uri) public {
        tokenAddress.transferFrom(msg.sender, owner(), price);
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _uri);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

}
```

## Configure hardhat.config.js

Now open the ```hardhat.config.js``` file and paste the following code in it

```bash
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
```

## ERC20 deploy script

Now create a file named ```deployERC20.js``` in the scripts folder and paste the following code in it

```bash
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
```

## ERC721 deploy script

Now create another file named ```deployERC721.js``` and paste the following code in it

```bash
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
```

## Deploing contracts on Rinkeby network

Now run the following command

``` npx hardhat run scripts/deployERC20.js --network rinkebyForERC20```

And you ill get a contract address at which contract is deployed. Copy this address and paste it in ``` .env ``` file as ``` ERC20_Contract_ADDRESS ```

Now deploy ERC721 contract by running the folllwoing command

``` npx hardhat run scripts/deployERC721.js --network rinkebyForERC721 ```

And you will gain get a contract address and paste it in the ``` .env ``` file aslo

## Buy nft scipt

Now create a file named ``` buyNFT.js ``` in the scripts folder and paste the following code in it

```bash
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
```

And run the following comand

``` npx hardhat run scripts/bytNFT.js --network rinkebyForERC20 ```

And you should get respons like that

![Ce](https://user-images.githubusercontent.com/96762657/188397061-6fa982dd-732b-4926-8b8c-210a22f8b954.PNG)

Now for confirmation of ERC20 transfer, check the metamask

And 0.5 IECT should be deducted from one account and credited into other account with 1 NFTB in the first account

0.5 IECT credited in one account

![2](https://user-images.githubusercontent.com/96762657/188432373-09088e71-b843-4b3e-b698-2d0a1582a2fa.PNG)

And the 0.5 IECT are deducted from this account with 1 NFTB credited

![333](https://user-images.githubusercontent.com/96762657/188432550-6c0d1100-c469-4c67-91ae-a6a4f3f01cab.PNG)

## Verifying the contracts on 

``` Etherscan.io ```

ERC20 Contract is verified at address 

``` 0x52B9B70122D77350559f9A1888fe02Bd81a4AEbB ```

ERC721 Contract is verified at address

``` 0xE49290F9D9CFA4Ef773C97Fb78af19960aeF6986 ```

