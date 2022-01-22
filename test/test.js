const fs = require('fs');
const { assert } = require('chai');

const Drawing = artifacts.require('Drawing');
const DrawingMarket = artifacts.require('DrawingMarket');

require('chai')
    .use(require('chai-as-promised'))
    .should();

contract('Drawing', (accounts) => {

    // Declare contract
    let contract;
    let market;

    before(async () => {
        contract = await Drawing.deployed();
        market = await DrawingMarket.deployed();
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
    
    describe('create', async () => {

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
            const tokenId = await contract.createToken(name, description, image);
            assert.isNotNull(tokenId);
        });

    })

    describe('market', async () => {

        it('return unsold items', async () => {
            console.log(await market.getUnsoldItems());
        })    
    
    })

})
