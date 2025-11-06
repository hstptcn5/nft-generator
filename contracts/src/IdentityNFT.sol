// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract IdentityNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    uint256 public constant MAX_SUPPLY = 10_000;
    uint256 public constant MINT_PERIOD = 48 hours;
    uint256 public startTime;
    uint256 public mintedCount;
    
    mapping(address => bool) public hasMinted;
    mapping(uint256 => uint256) public revealPhase;
    mapping(uint256 => string) public tokenMetadataURI;
    
    event NFTMinted(address indexed to, uint256 indexed tokenId, uint256 timestamp);
    event NFTRevealed(uint256 indexed tokenId, uint256 phase);
    
    constructor(address initialOwner) ERC721("Identity NFT", "IDNFT") Ownable(initialOwner) {
        startTime = block.timestamp;
    }
    
    function mint() external {
        require(block.timestamp <= startTime + MINT_PERIOD, "Mint period ended");
        require(mintedCount < MAX_SUPPLY, "Max supply reached");
        require(!hasMinted[msg.sender], "Already minted");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(msg.sender, tokenId);
        hasMinted[msg.sender] = true;
        mintedCount++;
        revealPhase[tokenId] = 1;
        
        emit NFTMinted(msg.sender, tokenId, block.timestamp);
    }
    
    function setTokenURI(uint256 tokenId, string memory uri) external onlyOwner {
        _setTokenURI(tokenId, uri);
    }
    
    function revealNFT(uint256 tokenId, uint256 phase) external onlyOwner {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        revealPhase[tokenId] = phase;
        emit NFTRevealed(tokenId, phase);
    }
    
    function getRevealPhase(uint256 tokenId) external view returns (uint256) {
        return revealPhase[tokenId];
    }
    
    function getRemainingSupply() external view returns (uint256) {
        return MAX_SUPPLY - mintedCount;
    }
    
    function isMintActive() external view returns (bool) {
        return block.timestamp <= startTime + MINT_PERIOD && mintedCount < MAX_SUPPLY;
    }
}

