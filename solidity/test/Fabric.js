
var Fabric = artifacts.require("./Fabric.sol");


contract('Fabric', function (accounts) {
    it("Init project test.", function () {
        return Fabric.deployed().then(function (instance) {
            FabricInstance = instance;
            return FabricInstance.contractName();
        }).then((name) => {
            assert.equal(name, 'Hyperledger Fabric Ethereum Smart-Contract.', 'Contract Name is correct');
            return FabricInstance.records(accounts[0]);
        }).then((reply) => {
            assert.equal(reply.toNumber(), 0, 'Reply is correct');
            return FabricInstance.createRecord({from: accounts[0]});
        }).then((reply) => {
            console.log(reply.tx)
            return FabricInstance.records(accounts[0]);
        }).then((reply) => {
            assert.equal(reply.toNumber(), 1, 'Reply is correct');
        })
    });
})