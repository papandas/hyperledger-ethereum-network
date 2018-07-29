pragma solidity ^0.4.23;

contract Fabric {

  address public contractName; 

  mapping (address => uint256) public records;

  constructor() public {

    contractName = "Hyperledger Fabric Ethereum Smart-Contract."; 

  }

  function createRecord() public {

    records[msg.sender] = records[msg.sender] + 1;

  }

}
