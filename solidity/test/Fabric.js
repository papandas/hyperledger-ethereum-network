
var Jobs = artifacts.require("./Jobs.sol");


contract('Fabric', function (accounts) {
    it("Init project test.", function () {
        return Jobs.deployed().then(function (instance) {
            JobsInstance = instance;
        })
    });
})