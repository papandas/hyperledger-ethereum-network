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

const AdminConnection = require('composer-admin').AdminConnection;
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const BusinessNetworkDefinition = require('composer-common').BusinessNetworkDefinition;

const hlc_idCard = require('composer-common').IdCard;
const path = require('path');
const _home = require('os').homedir();
const config = require('../../controller/env.json');

require('chai').should();

const network = 'hyperledger-eth-network';
const _timeout = 90000;
const NS = 'org.acme.HyperledgerEthereumNetwork';

// Seting up express js server

//Require the dev-dependencies


// end express js server


describe('Hyperledger fabric ethereum Blockchain Network', function () {
    this.timeout(_timeout);
    let businessNetworkConnection;
    before(function () {
        businessNetworkConnection = new BusinessNetworkConnection();
        return businessNetworkConnection.connect(config.composer.adminCard);
    });

    describe('#createOrder', () => {

        it('Should be able to asset.', () => {
            
        });


        it('Check the auth.', () => {
            
        });


    });
});

/**
 * display using console.log the properties of the inbound object
 * @param {displayObjectProperties} _name - string name of object
 * @param {displayObjectProperties}  _obj - the object to be parsed
 * @utility
 */
/*
function displayObjectProperties(_name, _obj)
{
    for(let propt in _obj){ console.log(_name+' object property: '+propt ); }
}
*/
/**
 * display using console.log the properties of each property in the inbound object
 * @param {displayObjectProperties} _string - string name of object
 * @param {displayObjectProperties}  _object - the object to be parsed
 * @utility
 */
/*
function displayObjectValues (_string, _object)
{
    for (let prop in _object){
        console.log(_string+'-->'+prop+':\t '+(((typeof(_object[prop]) === 'object') || (typeof(_object[prop]) === 'function'))  ? typeof(_object[prop]) : _object[prop]));
    }
}
*/
