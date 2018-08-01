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

// z2c-initiate.js
var connectionProfileName = "z2b-test-profile";
var networkFile = "hyperledger-eth-network.bna"
var businessNetwork = "hyperledger-eth-network";
var NS = 'org.acme.HyperledgerEthereumNetwork';

var allUsers = new Array();
var address_string, privatekey_string, con_string;

var isMainNet = false;
var EthereumURl = "https://rinkeby.etherscan.io"; // "https://etherscan.io"/


/**
* standard home page initialization routine
* Refer to this by {@link initPage()}.
*/
  function initPage ()
{
  console.log("Initial Page.")

  LoadUserList();

  if(isMainNet){
    $('#contractAddress').html('<h4>Ethereum Contract Address: <a href="'+EthereumURl+'/address/0xC0E7752546fa0b8D09a2c78304c75F67dbDbb1e3" target="_blank">0xC0E7752546fa0b8D09a2c78304c75F67dbDbb1e3</a></h4>');
  }else{
    $('#contractAddress').html('<h4>Ethereum Contract Address: <a href="'+EthereumURl+'/address/0x97D3b7F217124CeB6a9dd7563C6F3F1324117a95" target="_blank">0x97D3b7F217124CeB6a9dd7563C6F3F1324117a95</a></h4>');
  }

  /*$.when($.get('/composer/admin/getCreds')).done(function(results){
    console.log("getCreds", results);
  })*/

}

function LoadUserList(){
  console.log('Loading complete user list.');
  $('#user_list').empty();
  $.when($.get('/composer/admin/getMembers')).done(function(results){
    //console.log("Get Members", results)
    var _str = '';
    allUsers = new Array();
    for (each in results.members){
      (function(_idx, _arr){
        //console.log(_arr[_idx].email,_arr[_idx].fullname)
        if (_arr[_idx].email != 'noop@dummy'){
          _str +='<option value="'+_arr[_idx].email+'">' + _arr[_idx].email + '(' + _arr[_idx].fullname + ')' + '</option>';

          let _jsn = {};
          _jsn.email = _arr[_idx].email;
          _jsn.fullname = _arr[_idx].fullname;
          _jsn.accountAddress = _arr[_idx].accountAddress;
          _jsn.privateKey = _arr[_idx].privateKey;

          allUsers.push(_jsn)
        }
      })(each, results.members)
    }
    _str += '</select>';
          
    //$('#user_list').empty();
    $('#user_list').append(_str);

    LoadAssetList();

  });
}

function LoadAssetList() {
  var options = {};
  options.email = $('#user_list').find(':selected').val();

  $.when($.post('/composer/admin/getMyAssets', options)).done(function(results){
    //console.log("Get Assets", results)
    $('#assetList').empty();
    $('#assetList').append('<h2>Complete Transaction List of '+ $('#user_list').find(':selected').val() +'</h2>');
    for(let each in results.orders){
      (function(idx, arr){

        if($('#user_list').find(':selected').val() == (arr[idx].user).split('#')[1] ){
          let str = '<div>';
          str += '<div>Id: ' + arr[idx].TranId + '</div>';
          str += '<div>Created: ' + arr[idx].created + '</div>';
          str += '<div>Post Id: ' + arr[idx].PostId + '</div>';
          str += '<div>Hash Id: ' + arr[idx].HashId + '</div>';
          str += '<div>Transaction Hash: <a href="'+EthereumURl+'/tx/'+arr[idx].transactionHash+'" target="_blank">' + arr[idx].transactionHash + '</a></div>';
          str += '</div><hr/>';

          $('#assetList').append(str);
        }

      })(each, results.orders)
    }
  })
}

var SubmitATransaction = $('#SubmitATransaction');
SubmitATransaction.on('click', function(){
  var options = {};
  //options.fullname = $('#in_fullname').val();
  options.created = new Date().toISOString();
  options.email = $('#user_list').find(':selected').val();
  options.PostId = $('#PostId').val();
  options.HashId = $('#HashId').val();
  options.address = address_string;
  options.privatekey = privatekey_string;

  //console.log("Submit Transaction: ", options)

  $.when($.post('/composer/admin/addAssets', options)).done(function (results){ 
    console.log(results);
  })
})

////// SIGH UP BUTTON ///////////

var signupBtn = $('#SignUpBtn');
signupBtn.on('click', function(){

  var options = {};
  options.fullname = $('#in_fullname').val();
  options.email = $('#in_email').val();

  console.log("waiting for signup message")

  $.when($.post('/composer/admin/signup', options)).done(function (results){ 

    console.log(results);
    //alert('Sign Up Successfull');

  })

})


////////////// LOAD USER DETAIL ///////////////////////////


var loadUserDetails = $('#loadUserDetails');
loadUserDetails.on('click', function(){
  for (let each in allUsers){
    (function(_idx, _arr){
      if(_arr[_idx].email === $('#user_list').find(':selected').val() ){
        //console.log(arr[idx]);
        $('#userDetial').empty();
        var str= '';
        str += 'Email: ' + _arr[_idx].email;
        str += '<br/>Full Name: ' + _arr[_idx].fullname;
        str += '<br/>Account Hash : <a href="'+EthereumURl+'/address/' + _arr[_idx].accountAddress + '" target="_blank">' + _arr[_idx].accountAddress + '</a>';
        //str += '<br/>Private Key: ' + _arr[_idx].privateKey;
        
        address_string = _arr[_idx].accountAddress;
        privatekey_string = _arr[_idx].privateKey;
        
        $('#userDetial').html(str);

        $('#username').empty();
        $('#username').html(_arr[_idx].email);
      }
    })(each, allUsers)
  }
})


////////////////  GET TRANSACTION BY ID //////////////////////////

$('#GetTransactionById').on('click', function(){
  var options = {};
  options.TranId = $('#TransactionId').val();
  options.email = $('#user_list').find(':selected').val();

  $.when($.post('/composer/admin/getAssetsById', options)).done(function (results){ 

    //console.log(results);
    //alert('Sign Up Successfull');

    $('#assetList').empty();
    $('#assetList').append('<h2>Single Transaction '+ $('#user_list').find(':selected').val() +'</h2>');
    for(let each in results.orders){
      (function(idx, arr){

        //if($('#user_list').find(':selected').val() == (arr[idx].user).split('#')[1] ){
          let str = '<div>';
          str += '<div>Id: ' + arr[idx].TranId + '</div>';
          str += '<div>Created: ' + arr[idx].created + '</div>';
          str += '<div>Post Id: ' + arr[idx].PostId + '</div>';
          str += '<div>Hash Id: ' + arr[idx].HashId + '</div>';
          str += '<div>User/Account: ' + arr[idx].user + '</div>';
          str += '<div>Transaction Hash: <a href="'+EthereumURl+'/tx/'+arr[idx].transactionHash+'" target="_blank">' + arr[idx].transactionHash + '</a></div>';
          str += '</div><hr/>';

          $('#assetList').append(str);
        //}

      })(each, results.orders)

    }

  })

})



