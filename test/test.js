const fs = require('fs');
const { assert } = require('chai');
const { expectRevert } = require('@openzeppelin/test-helpers')
const ethers = require('ethers');

const Drawing = artifacts.require('Drawing');
const DrawingMarket = artifacts.require('DrawingMarket');

require('chai')
    .use(require('chai-as-promised'))
    .should();

contract('Drawing', (accounts) => {

    // Declare contract
    let contract;
    let market;

    beforeEach(async () => {
        market = await DrawingMarket.new({ from: accounts[0] });
        contract = await Drawing.new(market.address, { from: accounts[0] });
    })

    describe('deployment', async () => {
        it('deployment successfully', async () => {
            // Check on contract's address
            const address = contract.address;
            assert.notEqual(address, 0x0);
            assert.notEqual(address, '');
            assert.notEqual(address, null);
            assert.notEqual(address, undefined); 
        });

        it("has a name", async () => {
            // Get name of contract and check it
            assert.equal(await contract.name(), 'Drawing');
        });

        it("has a symbol", async () => {
            // Get symbol of contract and check it
            assert.equal(await contract.symbol(), 'DRAW');
        });

    })
    
    describe('create nft', async () => {

        it('svgToImageURI', async () => {
            const image = fs.readFileSync('./test/image.svg', { encoding: 'utf-8' });
            const imageURI = await contract.svgToImageURI(image);
            assert.isNotNull(imageURI);
        });

        it('createTokenURI', async () => {
            const name = 'name';
            const description = 'description';
            const image = 'image';
            const tokenURI = await contract.createTokenURI(name, description, image);
            assert.equal(tokenURI, 'data:application/json;base64,eyJuYW1lIjogIm5hbWUiLCAiZGVzY3JpcHRpb24iOiAiZGVzY3JpcHRpb24iLCAiYXR0cmlidXRlcyI6ICIiLCAiaW1hZ2UiOiAiaW1hZ2UiIH0=')
        });

        it('createToken', async () => {
            const name = 'name';
            const description = 'description';
            const image = 'image';
            const tx = await contract.createToken(name, description, image);
            const tokenId = tx.logs[2].args['2'].words[0];
            assert.equal(1, tokenId);
            
            const tokenURI = await contract.tokenURI(1);
            assert.equal(tokenURI, 'data:application/json;base64,eyJuYW1lIjogIm5hbWUiLCAiZGVzY3JpcHRpb24iOiAiZGVzY3JpcHRpb24iLCAiYXR0cmlidXRlcyI6ICIiLCAiaW1hZ2UiOiAiZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCxhVzFoWjJVPSIgfQ==');    
        });

    })

    describe('create market', async () => {

        it('Price must be at least 1 wei.', async () => {

            let listingPrice = await market.getListingPrice();
            listingPrice = listingPrice;
            
            const name = 'name';
            const description = 'description';
            const image = 'image';
            let tx = await contract.createToken(name, description, image);
            const tokenId = tx.logs[2].args['2'].words[0];
            assert.equal(1, tokenId);

            const auctionPrice = ethers.utils.parseUnits('0', 'ether');

            await expectRevert(
                market.create(contract.address, tokenId, auctionPrice, { value: listingPrice }),
                'Price must be at least 1 wei.'
            );

        });

        it('Price must be equal to listing price.', async () => {

            let listingPrice = await market.getListingPrice();
            listingPrice = listingPrice;
            
            const name = 'name';
            const description = 'description';
            const image = 'image';
            let tx = await contract.createToken(name, description, image);
            const tokenId = tx.logs[2].args['2'].words[0];
            assert.equal(1, tokenId);

            const auctionPrice = ethers.utils.parseUnits('1', 'ether');

            await expectRevert(
                market.create(contract.address, tokenId, auctionPrice, { value: auctionPrice }),
                'Price must be equal to listing price.'
            );

        });

    });

})
