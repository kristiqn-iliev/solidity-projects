// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
//SPDX-License-Identifier: MIT
// https://smartcontractshacking.com/#copyright-policy
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title rToken
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract rToken is ERC20 {

    // TODO: Complete this contract functionality
    address public underlyingToken;    
    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    constructor(address _underlyingToken, string memory _name, string memory _symbol)
    ERC20(_name, _symbol) {
        owner = msg.sender;
        underlyingToken = _underlyingToken;
    }

    function mint(uint256 _amount, address _to) external onlyOwner {
        _mint(_to, _amount); 
    }

    function burn(uint256 _amount, address _from) external onlyOwner {
        _burn(_from, _amount);
    }
}
