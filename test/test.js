const { assert } = require('chai');

const Drawing = artifacts.require('Drawing');

require('chai')
    .use(require('chai-as-promised'))
    .should();

contract('Drawing', (accounts) => {

    // Declare contract
    let contract;

    before(async () => {
        contract = await Drawing.deployed();
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

})