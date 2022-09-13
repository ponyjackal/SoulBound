// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MockToken is ERC721 {
    constructor() ERC721("MockToken", "MTK") {}

    function publicMint(uint256 tokenId) external {
        _mint(msg.sender, tokenId);
    }
}
