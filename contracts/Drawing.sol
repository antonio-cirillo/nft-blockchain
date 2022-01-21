// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "base64-sol/base64.sol";

contract Drawing is ERC721URIStorage {

    uint256 private _tokenCounter;

    constructor() ERC721("Drawing", "DRAW") public {
        _tokenCounter = 0; 
    }

    function create(string memory _name, string memory _description, string memory _svg) public {
        _safeMint(msg.sender, _tokenCounter);
        string memory _imageURI = svgToImageURI(_svg);
        string memory _tokenURI = createTokenURI(_name, _description, _imageURI);
        _setTokenURI(_tokenCounter, _tokenURI);
        _tokenCounter = _tokenCounter + 1;
    }

    // Format: data:image/svg+xml;base64,(Base64-encoding)
    function svgToImageURI(string memory _svg) public pure returns (string memory) {

        string memory _base = "data:image/svg+xml;base64,";
        string memory _base64encoded = Base64.encode(
            bytes(string(abi.encodePacked(_svg))));
        string memory imageURI = string(abi.encodePacked(_base, _base64encoded));
        return imageURI;
    
    }

    function createTokenURI(string memory _name, string memory _description, 
            string memory _imageURI) public pure returns (string memory) {
        
        string memory _base = "data:application/json;base64,";
        return string(abi.encodePacked(
            _base,
            Base64.encode(
                bytes(abi.encodePacked(
                    '{"name": "', _name, '"', 
                    ', "description": "', _description, '"', 
                    ', "attributes": ""',
                    ', "image": "', _imageURI, '" }'))
            )
        ));
   
    }

}