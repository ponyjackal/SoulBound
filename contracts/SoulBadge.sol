// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.4;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./ERC5114/ERC5114SoulBadge.sol";

contract SoulBadge is ERC5114SoulBadge, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    // Token image (all token use same image)
    string public tokenImageUri;

    // Max mint supply
    uint256 public mintSupply;

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _collectionUri,
        string memory _tokenImageUri
    ) ERC5114SoulBadge(_name, _symbol, _collectionUri, "") {
        tokenImageUri = _tokenImageUri;
        // default mint supply 10k
        mintSupply = 10000;
    }

    // Caller must not be an wallet account
    modifier callerIsUser() {
        require(tx.origin == msg.sender, "Caller should not be a contract");
        _;
    }

    // Caller must be `Soul` token owner
    modifier callerIsSoulOwner(address soulContract, uint256 soulTokenId) {
        require(soulContract != address(0), "Soul contract is the zero address");
        require(msg.sender == _getSoulOwnerAddress(soulContract, soulTokenId), "Caller is not Soul token owner");
        _;
    }

    /**
     * @dev {IERC5114-tokenUri} alias to tokenURI(), so we just override tokenURI()
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "Non-existent token");

        string memory output = string(
            abi.encodePacked('{"name":"', name, " #", _toString(tokenId), '","image":"', tokenImageUri, '"}')
        );
        return string(abi.encodePacked("data:application/json;utf8,", output));
    }

    // Returns total valid token count
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    // Create a new token for Soul
    function _runMint(address soulContract, uint256 soulTokenId) private nonReentrant {
        require(_tokenIdCounter.current() < mintSupply, "Max minting supply reached");

        // mint to Soul contract and Soul tokenId
        _mint(_tokenIdCounter.current(), soulContract, soulTokenId);
        _tokenIdCounter.increment();
    }

    // Public minting, limited to Soul Token owner
    function publicMint(address soulContract, uint256 soulTokenId)
        external
        callerIsUser
        callerIsSoulOwner(soulContract, soulTokenId)
    {
        _runMint(soulContract, soulTokenId);
    }
}
