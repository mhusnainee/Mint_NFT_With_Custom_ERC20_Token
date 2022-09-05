// SPDX-License-Identifier: MIT
pragma solidity >= 0.7.0 < 0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MYERC20 is ERC20 {
    constructor() ERC20("IECToken", "IECT") {
        _mint(msg.sender, 1000 * 10 ** decimals());
    }
}