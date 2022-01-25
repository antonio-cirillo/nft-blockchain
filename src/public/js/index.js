let value;

App = {

    web3Provider: null,
    contracts: {},

    init: async () => {
        return await App.initWeb3();        
    },

    initWeb3: async () => {
        // Modern dapp browsers...
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
            // Request account access
            await window.ethereum.request({ method: "eth_requestAccounts" });;
            } catch (error) {
            // User denied account access...
            console.error("User denied account access")
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }
        web3 = new Web3(App.web3Provider);

        return await App.initContract();
    },

    initContract: async () => {
        await $.getJSON('../build/contracts/Drawing.json', function(data) {
            // Get the necessary contract artifact file and instantiate it with @truffle/contract
            const DrawingArtifact = data;
            App.contracts.Drawing = TruffleContract(DrawingArtifact);
          
            // Set the provider for our contract
            App.contracts.Drawing.setProvider(App.web3Provider);          
        });
        await $.getJSON('../build/contracts/DrawingMarket.json', function(data) {
            // Get the necessary contract artifact file and instantiate it with @truffle/contract
            const DrawingMarketArtifact = data;
            App.contracts.DrawingMarket = TruffleContract(DrawingMarketArtifact);
          
            // Set the provider for our contract
            App.contracts.DrawingMarket.setProvider(App.web3Provider);          
        });

        return await App.getUnsoldItems();
    },

    getUnsoldItems: async () => {
        let drawingMarketInstance;

        web3.eth.handleRevert = true;

        await web3.eth.getAccounts(function(error, accounts) {
            
            if (error) {
                console.log(error);
            }

            const account = accounts[0];
            App.contracts.DrawingMarket.deployed().then(async function(instance) {
                drawingMarketInstance = instance;

                try {
                    const items = await drawingMarketInstance.getUnsoldItems({ from: account });
                    for (const item of items) {
                        console.log(item)
                    }
                } catch (error) {
                    console.log(error);
                    $("#items").append("<p>There are currently no tokens for sale!</p>")
                }

            });

        });

    },

    createMarketSale: async (tokenId, price) => {
        let drawingMarketInstance;
        let drawingInstance;

        await web3.eth.getAccounts(function(error, accounts) {
            
            if (error) {
                console.log(error);
            }

            const account = accounts[0];

            App.contracts.DrawingMarket.deployed().then(async function(instance) {
                
                drawingMarketInstance = instance;

            });
            
        });

    }

}

$(function() {
    $(window).load(function() {
        App.init();
    });
});

const createItem = (result) => {
    const item = `<div class="col-sm-6 col-md-4 product-item animation-element slide-top-left">`
        + `<div class="product-container" style="height: 100%;padding-bottom: 0px;">`
        + `<div class="row">`
        + `<div class="col-md-12"><img class="img-fluid" src="${result.image}" style="display: block;margin-left: auto;margin-right: auto"></div>`
        + `</div>`
        + `<div class="row">`
        + `<div class="col-12">`
        + `<h2 style="color: rgb(78,115,225);margin-top: 20px">${result.name}</h2>`
        + `</div>`
        + `</div>`
        + `<div class="row">`
        + `<div class="col-12">`
        + `<p class="product-description" style="margin-top: 0px;margin-bottom: 10px">${result.description}</p>`
        + `</div>`
        + `</div>`
        + `<div class="card shadow mb-4" style="margin-top: 12px;">`
        + `<div class="card-header py-3">`
        + `<h6 class="m-0 fw-bold" style="color: rgb(78,115,225)">You want to sell this token?</h6>`
        + `</div>`
        + `<div class="card-body">`
        + `<div class="user">`
        + `<div class="mb-3"><input id="price${result.tokenId}" class="form-control form-control-user" placeholder="Enter price in ETH" name="price"></div><button class="btn btn-primary d-block btn-user w-100" onclick="sell(${result.tokenId})" type="submit" style="background: rgb(78,115,225);">Sell Now!</button>`
        + `</div>`
        + `</div>`
        + `</div>`
        + `</div>`
        + `</div>`
    return item;
}

async function buy(tokenId) {

    const price = $(`#price${tokenId}`).val();
    if (price == '') {
        toastr.error("Price is not valid!");
    } else {
        if (!/(([0-9]+)(\.[0-9]+)?)/.test(price)) {
            toastr.error("Price is not valid!");
        } else {
            if (price <= 0) {
                toastr.error("Price is not valid!");
            } else {
                await App.create(tokenId, price);
            }
        }
    }

}