// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Drawing is ERC721 {

    constructor() ERC721("Drawing", "DRAW") public { }

}