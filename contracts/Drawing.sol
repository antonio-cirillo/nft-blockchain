// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "base64-sol/base64.sol";

contract Drawing is ERC721URIStorage {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    event TokenCreated(string imageURI, string tokenURI, uint256 tokenId);

    constructor() ERC721("Drawing", "DRAW") { }

    function createToken(string memory name, string memory description, 
            string memory svg) public returns (uint256) {

        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();

        _safeMint(msg.sender, tokenId);
        string memory tokenURI = createTokenURI(name, description, svg);
        _setTokenURI(tokenId, tokenURI);
        
        emit TokenCreated(svg, tokenURI, tokenId);

        return tokenId;
    
    }

    function getMyTokens() public view returns (string[] memory, uint256[] memory) {
        
        uint256 totalTokenCount = _tokenIds.current();
        require(totalTokenCount > 0, "There are no tokens.");

        uint256 myTotalTokenCount = 0;

        for (uint256 i = 1; i < totalTokenCount + 1; i++) {            
            // If item at index i is owned by msg.sender
            if (super.ownerOf(i) == msg.sender)
                myTotalTokenCount++;
        }

        require(myTotalTokenCount > 0, "Caller must be have at least 1 token.");

        uint256 currentIndex = 0;
        uint256[] memory ids = new uint256[](myTotalTokenCount);
        string[] memory myTokens = new string[](myTotalTokenCount);
        
        for (uint256 i = 1; i < totalTokenCount + 1; i++) {
            // If item at index i is owned by msg.sender
            if (super.ownerOf(i) == msg.sender) {
                // Add to array and increment index of array
                myTokens[currentIndex] = super.tokenURI(i);
                ids[currentIndex] = i;
                currentIndex++; 
            }
        }
        
        return (myTokens, ids);

    }

    // Format: data:image/svg+xml;base64,(Base64-encoding)
    function svgToImageURI(string memory svg) public pure returns (string memory) {

        string memory base = "data:image/svg+xml;base64,";
        string memory base64encoded = Base64.encode(
            bytes(string(abi.encodePacked(svg))));
        string memory imageURI = string(abi.encodePacked(base, base64encoded));
        return imageURI;
    
    }

    function createTokenURI(string memory name, string memory description, 
            string memory imageURI) public pure returns (string memory) {
        
        string memory base = "data:application/json;base64,";
        return string(abi.encodePacked(
            base,
            Base64.encode(
                bytes(abi.encodePacked(
                    '{"name": "', name, '"', 
                    ', "description": "', description, '"', 
                    ', "attributes": ""',
                    ', "image": "', imageURI, '" }'))
            )
        ));
   
    }

}
