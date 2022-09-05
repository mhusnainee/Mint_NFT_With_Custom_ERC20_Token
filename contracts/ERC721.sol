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