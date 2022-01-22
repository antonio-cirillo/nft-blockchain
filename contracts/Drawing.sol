// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "base64-sol/base64.sol";

contract Drawing is ERC721URIStorage {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    address contractAddress;

    constructor(address marketplaceAddress) ERC721("Drawing", "DRAW") public { 
        contractAddress = marketplaceAddress;
    }

    function createToken(string memory name, string memory description, 
            string memory svg) public returns (uint) {

        _tokenIds.increment();
        uint256 tokenCounter = _tokenIds.current();

        _safeMint(msg.sender, tokenCounter);
        string memory imageURI = svgToImageURI(svg);
        string memory tokenURI = createTokenURI(name, description, imageURI);
        _setTokenURI(tokenCounter, tokenURI);
        setApprovalForAll(contractAddress, true);
        
        return tokenCounter;
    
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
