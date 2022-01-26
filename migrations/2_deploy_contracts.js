const Drawing = artifacts.require('Drawing');
const DrawingMarket = artifacts.require('DrawingMarket');

module.exports = function(deployer) {
    deployer.deploy(DrawingMarket);
    deployer.deploy(Drawing);
}
