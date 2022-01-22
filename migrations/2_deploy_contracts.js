const Drawing = artifacts.require('Drawing');
const DrawingMarket = artifacts.require('DrawingMarket');

module.exports = function(deployer) {
    deployer.deploy(DrawingMarket)
    .then(() => {
        return deployer.deploy(Drawing, DrawingMarket.address);
    });
}
