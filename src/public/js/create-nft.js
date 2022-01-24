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
    },

    createNFT: async (name, description, svg) => {
        let drawingInstance;

        await web3.eth.getAccounts(function(error, accounts) {
            
            if (error) {
                console.log(error);
            }

            const account = accounts[0];
            App.contracts.Drawing.deployed().then(function(instance) {
                drawingInstance = instance;

                return drawingInstance.createToken(name, description, svg, { from: account });
            }).then(function(result) {
                window.location.href = "./my-nft?action=created";
            }).catch(function(err) {
                window.location.href = "./my-nft?action=error";
            });

        });

    }

}

$(function() {
    $(window).load(function() {
        App.init();
        $("#createNFT").click(async () => {            
            const name = $("#name").val();
            const description = $("#description").val();
            const svg = value;

            if (name == '' || description == '' || svg == '') {
                toastr.error("Error in input fields...");
            } else {
                await App.createNFT(name, description, svg);
            }

        });
    });
});
