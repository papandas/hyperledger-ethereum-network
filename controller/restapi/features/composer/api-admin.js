
/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


'use strict';
const fs = require('fs');
const path = require('path');
const _home = require('os').homedir();
const Tx = require('ethereumjs-tx');
const Web3 = require('web3');
const infuraURL = 'https://mainnet.infura.io/v3/c3f6a4d6a7ff4f17854469b8f01ee819'
const web3 = new Web3(infuraURL);
const ContractAddress = '0xC0E7752546fa0b8D09a2c78304c75F67dbDbb1e3';
const ABI = [{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"records","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"createRecord","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"contractName","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];

const hlc_idCard = require('composer-common').IdCard;
const composerAdmin = require('composer-admin');
const AdminConnection = require('composer-admin').AdminConnection;
const BusinessNetworkDefinition = require('composer-common').BusinessNetworkDefinition;
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const config = require('../../../env.json');
const NS = 'org.acme.HyperledgerEthereumNetwork';


/**
 * display the admin and network info
 * @constructor
 */

exports.getCreds = function(req, res, next) {
    //res.send(config);

    /*var contract = new web3.eth.Contract(ABI, ContractAddress);
    contract.methods.contractName()
    .call((err, res)=>{
        console.log(res)
    })
    
    
    web3.eth.getTransactionCount(account1, (err, txCount) => {

    const txObject = {
        nonce: web3.utils.toHex(txCount),
        to: account2,
        value: web3.utils.toHex(web3.utils.toWei('1', 'ether')),
        gasLimit: web3.utils.toHex(21000),
        gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei'))
    }

    console.log('Tx Object:', txObject);

    const tx = new Tx(txObject);
    //console.log(tx);
    tx.sign(privateKey1);

    const serializedTransaction = tx.serialize();
    const raw = '0x' + serializedTransaction.toString('hex');

    web3.eth.sendSignedTransaction(raw, (err, txHash) => {
        console.log('txHash:', txHash);

        
    })
})*/

    

    
    

   //const AccountPrivateKey = '0x5750f84af75d3a4c6769b1fd97d4ecdaaf39606d95e941f923fdd2561119c2dd'

   //console.log(AccountPrivateKey.substr(2))*/

    res.send("Hi How are you ?")
};

/**
 * Create an instance of the AdminConnection class (currently a no-op)
 * @constructor
 */
exports.adminNew = function() {

};



exports.getAssetsById = function (req, res, next) {

    let method = 'getAssetsById';
    console.log(method+' req.body.email is: '+req.body.email );
    let allOrders = new Array();
    let businessNetworkConnection;
    //if (svc.m_connection === null) {svc.createMessageSocket();}
    let serializer;
    let factory;
    let archiveFile = fs.readFileSync(path.join(path.dirname(require.main.filename),'network','dist','agrichain-network.bna'));
    businessNetworkConnection = new BusinessNetworkConnection();
    return BusinessNetworkDefinition.fromArchive(archiveFile)
    .then((bnd) => {
        serializer = bnd.getSerializer();

        //console.log(method+' req.body.email is: '+req.body.email );
        return businessNetworkConnection.connect(req.body.email)
        .then(() => {
            //return businessNetworkConnection.query('selectAssets')
            return businessNetworkConnection.query('selectAssetsById', {aid:req.body.agriAssetId} )
            .then((orders) => {
                allOrders = new Array();
                for (let each in orders)
                    { (function (_idx, _arr){    
                        let _jsn = serializer.toJSON(_arr[_idx]);
                        _jsn.id = _arr[_idx].agriAssetId;
                        allOrders.push(_jsn);
                    })(each, orders);
                }
                res.send({'result': 'success', 'orders': allOrders});
            })
            .catch((error) => {console.log('selectOrders failed ', error);
                res.send({'result': 'failed', 'error': 'selectOrders: '+error.message});
            });
        })
        .catch((error) => {console.log('businessNetwork connect failed ', error);
            res.send({'result': 'failed', 'error': 'businessNetwork: '+error.message});
        });
    })
    .catch((error) => {console.log('create bnd from archive failed ', error);
        res.send({'result': 'failed', 'error': 'create bnd from archive: '+error.message});
    });

}


/**
 * get all orders
 * @param {express.req} req - the inbound request object from the client
 *  req.body.id - the id of the buyer making the request
 *  req.body.email - the user id of the buyer in the identity table making this request
 *  req.body.secret - the pw of this user.
 * @param {express.res} res - the outbound response object for communicating back to client
 * @param {express.next} next - an express service to enable post processing prior to responding to the client
 * @returns {Array} an array of assets
 * @function
 */
exports.getMyAssets = function (req, res, next) {
    // connect to the network
    let method = 'getMyAssets';
    console.log(method+' req.body.email is: '+req.body.email );
    let allOrders = new Array();
    let businessNetworkConnection;
    //if (svc.m_connection === null) {svc.createMessageSocket();}
    let serializer;
    let factory;
    let archiveFile = fs.readFileSync(path.join(path.dirname(require.main.filename),'network','dist','hyperledger-eth-network.bna'));
    businessNetworkConnection = new BusinessNetworkConnection();
    return BusinessNetworkDefinition.fromArchive(archiveFile)
    .then((bnd) => {
        serializer = bnd.getSerializer();

        //console.log(method+' req.body.email is: '+req.body.email );
        return businessNetworkConnection.connect(req.body.email)
        .then(() => {
            return businessNetworkConnection.query('selectTransaction')
            .then((orders) => {
                allOrders = new Array();
                for (let each in orders){ 
                    //console.log("==========================");
                    //console.log(orders);
                    (function (_idx, _arr){    
                        let _jsn = serializer.toJSON(_arr[_idx]);
                        _jsn.id = _arr[_idx].TranId;
                        allOrders.push(_jsn);
                    })(each, orders);
                }
                res.send({'result': 'success', 'orders': allOrders});
            })
            .catch((error) => {console.log('selectOrders failed ', error);
                res.send({'result': 'failed', 'error': 'selectOrders: '+error.message});
            });
        })
        .catch((error) => {console.log('businessNetwork connect failed ', error);
            res.send({'result': 'failed', 'error': 'businessNetwork: '+error.message});
        });
    })
    .catch((error) => {console.log('create bnd from archive failed ', error);
        res.send({'result': 'failed', 'error': 'create bnd from archive: '+error.message});
    });
};


/**
 * get all assets
 * @param {express.req} req - the inbound request object from the client
 *  req.body.id - the id of the buyer making the request
 *  req.body.email - the user id of the buyer in the identity table making this request
 *  req.body.registry - the pw of this user.
 * @param {express.res} res - the outbound response object for communicating back to client
 * @param {express.next} next - an express service to enable post processing prior to responding to the client
 * @returns {Array} an array of assets
 * @function
 */
exports.getAssetsByParticipant = function (req, res, next) {
    // connect to the network
    let method = 'getAssetsByParticipant';
    console.log(method+' req.body.email is: '+req.body.email );
    let allOrders = new Array();
    let businessNetworkConnection;
    //if (svc.m_connection === null) {svc.createMessageSocket();}
    let serializer;
    let factory;
    let archiveFile = fs.readFileSync(path.join(path.dirname(require.main.filename),'network','dist','agrichain-network.bna'));
    businessNetworkConnection = new BusinessNetworkConnection();
    return BusinessNetworkDefinition.fromArchive(archiveFile)
    .then((bnd) => {
        serializer = bnd.getSerializer();

        console.log(method+' req.body.email is: '+req.body.email);
        //config.composer.adminCard
        return businessNetworkConnection.connect(req.body.email)
        .then(() => {
            
            factory = businessNetworkConnection.getBusinessNetwork().getFactory();
            const participant = factory.newRelationship(NS, req.body.registry, req.body.email);
            console.log('resource:' + participant.$namespace + '.' + participant.$type + '#'+ participant.$identifier);
            
            const data = 'resource:' + participant.$namespace + '.' + participant.$type + '#'+ participant.$identifier;
            const email = 'email';

            let queryStr = '';
            if(req.body.registry == 'Producer'){
                queryStr = 'selectAssetsByProducer';
            }else{
                queryStr = 'selectAssetsByDistributor';
            }

            console.log(queryStr)

            return businessNetworkConnection.query(queryStr,{email:data} ) 
            .then((orders)=>{
                //console.log(orders);
                allOrders = new Array();
                for (let each in orders){
                    (function (_idx, _arr){
                        let _jsn = serializer.toJSON(_arr[_idx]);
                        _jsn.id = _arr[_idx].agriAssetId;
                        allOrders.push(_jsn);
                    })(each, orders);
                }
                res.send({'result': 'success', 'orders': allOrders});
            }).catch((error)=>{
                console.log('error while query : ', error)
                res.send({'result': 'failed', 'error': 'query not found: '+error.message});
            })

        }).catch((error)=>{
            console.log('Business Network Count not be connected: ', error)
            res.send({'result': 'failed', 'error': 'business network can not be connected: '+error.message});
        })
    }).catch((error) => {console.log('create bnd from archive failed ', error);
        res.send({'result': 'failed', 'error': 'create bnd from archive: '+error.message});
    });
};



/**
 * adds an asset to the blockchain
 * @param {express.req} req - the inbound request object from the client
 * req.body.producer - string with producer id
 * req.body.distributor - string with distributor id
 * req.body.items - array with items for asset
 * @param {express.res} res - the outbound response object for communicating back to client
 * @param {express.next} next - an express service to enable post processing prior to responding to the client
 * @returns {Array} an array of assets
 * @function
 */
exports.addAssets = function (req, res, next) {
    let method = 'addAssets';
    console.log(method+' req.body.email is: '+req.body.email );
    let businessNetworkConnection;
    let factory;
    let ts = Date.now();
    let txHash = '';
    let TranId = req.body.email.replace(/@/, '').replace(/\./, '')+ts;
    //if (svc.m_connection === null) {svc.createMessageSocket();}
    
    
    const account = req.body.address;
    const AccountPrivateKey = req.body.privatekey; 
    console.log(account, AccountPrivateKey.substr(2))
    const privateKey = Buffer.from(AccountPrivateKey.substr(2), 'hex');

    const contract = new web3.eth.Contract(ABI, ContractAddress);
    //contract.methods.contractName().call((err, res)=>{console.log(res)})

    web3.eth.getTransactionCount(account, (err, txCount) => {

        if(err != null){
            console.log(err.message);
        }

        // contract.methods.records(account)

        const data = contract.methods.records(account).encodeABI();

        const txObject = {
            nonce: web3.utils.toHex(txCount),
            to: ContractAddress,
            data: data,
            gasLimit: web3.utils.toHex(100000),
            gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei'))
        }

        const tx = new Tx(txObject);
        tx.sign(privateKey);

        const serializedTransaction = tx.serialize();
        const raw = '0x' + serializedTransaction.toString('hex');

        web3.eth.sendSignedTransaction(raw, (err, _txHash) => {

            if(err != null){
                console.log(err.message);
            }
            txHash = _txHash;
            console.log('txHash:', txHash);

            businessNetworkConnection = new BusinessNetworkConnection();
            return businessNetworkConnection.connect(req.body.email)
            .then(() => {

                //const _user = factory.newResource(NS, 'User', req.body.email);
                //console.log(_user, "============" ,_user.$identifier);

                factory = businessNetworkConnection.getBusinessNetwork().getFactory();
                let tran = factory.newResource(NS, 'ContractTran', TranId);
                tran.created = req.body.created;
                tran.PostId = req.body.PostId;
                tran.HashId = req.body.HashId;
                tran.transactionHash = txHash;
                tran.user = factory.newRelationship(NS, 'User', req.body.email);
                
                const createNew = factory.newTransaction(NS, 'CreateTran');
                createNew.contracttran = factory.newRelationship(NS, 'ContractTran', tran.$identifier);
                createNew.user = factory.newRelationship(NS, 'User', req.body.email);
                
                // add the order to the asset registry.
                return businessNetworkConnection.getAssetRegistry(NS+'.ContractTran')
                .then((assetRegistry) => {
                    return assetRegistry.add(tran)
                        .then(() => {
                            res.send({'result': 'asset '+TranId+' successfully added'});
                            /*return businessNetworkConnection.submitTransaction(createNew)
                            .then(() => {console.log('asset '+TranId+' successfully added');
                                res.send({'result': 'asset '+TranId+' successfully added'});
                            })
                            .catch((error) => {
                                if (error.message.search('MVCC_READ_CONFLICT') !== -1)
                                    {console.log(TranId+' retrying assetRegistry.add for: '+TranId);
                                    //loadTransaction(createNew, TranId, businessNetworkConnection);
                                }
                                else
                                {console.log(TranId+' submitTransaction failed with text: ',error.message);}
                            });*/
                        })
                        .catch((error) => {
                            if (error.message.search('MVCC_READ_CONFLICT') !== -1)
                                {console.log(TranId+' retrying assetRegistry.add for: '+TranId);
                                //loadTransaction(createNew, orderNo, businessNetworkConnection);
                            }
                            else
                            {
                                console.log(TranId+' assetRegistry.add failed: ',error.message);
                                res.send({'result': 'failed', 'error':' order '+TranId+' getAssetRegistry failed '+error.message});
                            }
                        });
                })
                .catch((error) => {
                    console.log(TranId+' getAssetRegistry failed: ',error.message);
                    res.send({'result': 'failed', 'error':' order '+TranId+' getAssetRegistry failed '+error.message});
                });
            })
            .catch((error) => {
                console.log(TranId+' business network connection failed: text',error.message);
                res.send({'result': 'failed', 'error':' order '+TranId+' add failed on on business network connection '+error.message});
            });
            
        })

    })


    
};



/**
 * orderAction - act on an order 
 * @param {express.req} req - the inbound request object from the client
 * req.body.action - string with 
 * req.body.distributorID - (optional, only required during the time of selling to asset to distributor)while selling to distributor
 * @param {express.res} res - the outbound response object for communicating back to client
 * @param {express.next} next - an express service to enable post processing prior to responding to the client
 * @returns {Array} an array of assets
 * @function
 */
exports.assetsAction = function (req, res, next) {
    let method = 'assetsAction';
    console.log(method+' req.body.participant is: '+req.body.participant );
    
    
    let businessNetworkConnection;
    let updateOrder;
    businessNetworkConnection = new BusinessNetworkConnection();
    
    return businessNetworkConnection.connect(req.body.participant)
    .then(() => {
        return businessNetworkConnection.getAssetRegistry(NS+'.AgriAsset')
        .then((assetRegistry) => {
            return assetRegistry.get(req.body.agriAssetId)
            .then((order) => {

                let factory = businessNetworkConnection.getBusinessNetwork().getFactory();

                console.log("Asset Processing.. Please Wait..")
            
                updateOrder = order;
                updateOrder.quantity = req.body.quantity;
                switch (req.body.action)
                {
                    case 'SELLING':
                        updateOrder.status = req.body.action;
                        const distributor = factory.newRelationship(NS, 'Distributor', req.body.distributorID);
                        distributor.accountBalance = ( parseInt(order.quantity) - parseInt(req.body.quantity) ).toString;
                        updateOrder.distributor = distributor;

                        break;
                    case 'SELL':
                        const consumer = factory.newRelationship(NS, 'Consumer', req.body.customerID);
                        consumer.unitPurchased = parseInt(req.body.unitPurchased);

                        if (updateOrder.consumer) {
                            updateOrder.consumer.push(consumer);
                        } else {
                            updateOrder.consumer = [consumer];
                        }
                        break;
                }

                return businessNetworkConnection.getAssetRegistry(NS+'.AgriAsset')
                .then((assetRegistry) => {
                    return assetRegistry.update(updateOrder)
                    .then(()=>{
                        console.log("Updated");
                        res.send({'result': 'success'});
                    })
                })

            })
            .catch((error) => {
                console.log('Registry Get Order failed: '+error.message);
                res.send({'result': 'failed', 'error': 'Registry Get Order failed: '+error.message});
            });
        })
        .catch((error) => {console.log('Get Asset Registry failed: '+error.message);
            res.send({'result': 'failed', 'error': 'Get Asset Registry failed: '+error.message});
        });
    })
    .catch((error) => {console.log('Business Network Connect failed: '+error.message);
        res.send({'result': 'failed', 'error': 'Get Asset Registry failed: '+error.message});
    });
};



/**
 * retrieve array of members from specified registry type
 * @param {express.req} req - the inbound request object from the client
 *  req.body.registry: _string - type of registry to search; e.g. 'Producer', 'Distributor', 'Consumer'.
 * @param {express.res} res - the outbound response object for communicating back to client
 * @param {express.next} next - an express service to enable post processing prior to responding to the client
 * @returns {Object} an array of members
 * @function
 */
exports.getMembers = function(req, res, next) {
    //console.log("Admin -> getMembers", req.body.registry)
    // connect to the network
    // let method = 'getMembers';
    let allMembers = new Array();
    let businessNetworkConnection;
    businessNetworkConnection = new BusinessNetworkConnection();
    // connection prior to V0.15
    // return businessNetworkConnection.connect(config.composer.connectionProfile, config.composer.network, config.composer.adminID, config.composer.adminPW)
    // connection in v0.15
    return businessNetworkConnection.connect(config.composer.adminCard)
        .then(() => {
            return businessNetworkConnection.getParticipantRegistry(NS+'.User')
            .then(function(registry){
                return registry.getAll()
                .then ((members) => {
                    for (let each in members)
                        { (function (_idx, _arr)
                            { let _jsn = {};
                            _jsn.email = _arr[_idx].email;
                            _jsn.fullname = _arr[_idx].fullname;
                            _jsn.accountAddress = _arr[_idx].accountAddress;
                            _jsn.privateKey = _arr[_idx].privateKey;

                            allMembers.push(_jsn); })(each, members);
                    }
                    res.send({'result': 'success', 'members': allMembers});
                })
                .catch((error) => {console.log('error with getAllMembers', error);
                    res.send({'result': 'failed '+error.message, 'members': []});});
            })
        .catch((error) => {console.log('error with getRegistry', error);
            res.send({'result': 'failed '+error.message, 'members': []});});
        })
        .catch((error) => {console.log('error with business network Connect', error.message);
            res.send({'result': 'failed '+error.message, 'members': []});});
};


/**
 * SignUp for the new participant
 * @param {express.req} req - the inbound request object from the client
 *  req.body.email: _string - the username or email of the member.
 *  req.body.pass: _string - the password string of the member 
 *  req.body.cell: _string - cell numbr of the particapent
 *  req.body.fullname: _string - the full name of the particapent
 *  req.body.registry: _string - type of registry to search; e.g. 'Producer', 'Distributor', 'Consumer'.
 * @param {express.res} res - the outbound response object for communicating back to client
 * @param {express.next} next - an express service to enable post processing prior to responding to the client
 * @returns {Object} an array of members
 * @function
 */

exports.SignUp = function(req, res, next) {
    //let memberTable = new Array();
    let businessNetworkConnection;
    let factory;
    var accounts = web3.eth.accounts.create();
    let participant;
    let adminConnection = new AdminConnection();
    adminConnection.connect(config.composer.adminCard)
    .then(()=>{
        businessNetworkConnection = new BusinessNetworkConnection();
        return businessNetworkConnection.connect(config.composer.adminCard)
        .then(() => {
            
            factory = businessNetworkConnection.getBusinessNetwork().getFactory();
            return businessNetworkConnection.getParticipantRegistry(NS+'.User')
            .then((participantRegistry)=>{
                return participantRegistry.get(req.body.email)
                .then((_res) => { res.send('member already exists. add cancelled');})
                .catch((_res) => {
                    //console.log(req.body.email+' not in '+req.body.registry+' registry. ');

                    console.log("address", accounts.address, "|", accounts.privateKey)
                    
                    const participant = factory.newResource(NS, 'User', req.body.email);
                    participant.fullname = req.body.fullname;
                    participant.accountAddress = accounts.address;
                    participant.privateKey = accounts.privateKey;

                    return participantRegistry.add(participant)
                    .then(() => {
                        console.log(req.body.fullname+' successfully added as a User' ); 
                        res.send(req.body.fullname+' successfully added');
                    })
                    .then(() => {
                        // an identity is required before a member can take action in the network.
                        console.log('issuing identity for:'+ NS +'.User#'+req.body.email);
                        return businessNetworkConnection.issueIdentity(NS+'.User#'+req.body.email, req.body.email)
                        .then((result) => {
                            //console.log(result)
                            //console.log('Email: '+req.body.email, 'Return-Email:', result.userID);
                            
                            let _meta = {};
                            for (each in config.composer.metaData){
                                (function(_idx, _obj) {
                                    _meta[_idx] = _obj[_idx]; 
                                })(each, config.composer.metaData); 
                            }
                            _meta.businessNetwork = config.composer.network;
                            _meta.userName = result.userID;
                            _meta.enrollmentSecret = result.userSecret;
                            config.connectionProfile.keyValStore = _home+config.connectionProfile.keyValStore;
                            //console.log(".keyValStore", config.connectionProfile.keyValStore)
                            let tempCard = new hlc_idCard(_meta, config.connectionProfile);

                            return adminConnection.importCard(result.userID, tempCard)
                            .then ((_res) => { 
                                if (_res) {
                                    console.log('card updated');
                                } else {
                                    console.log('card imported');
                                } 

                                //const account1 = '0xaE0ba611603Ec52104c9aB52deDA584806BBEc14';

                                //web3.eth.getBalance(account1, (err, res) => {
                                    //console.log('Account 1 Balance:', web3.utils.fromWei(res, 'ether'));
                                //})
                            })
                            .catch((error) => {
                                console.error('adminConnection.importCard failed. ',error.message);
                            });
                        })
                    })
                    .catch((error) => {
                        console.log(req.body.fullname+' add failed', error); 
                        res.send(error);
                    });
                });
            }).catch((error) => {console.log('error with getParticipantRegistry', error); res.send(error);});
        }).catch((error) => {console.log('error with businessNetworkConnection', error); res.send(error);});
    }).catch((error) => {console.log('error with adminConnect', error.message); res.send(error);});
};