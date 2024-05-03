// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
//SPDX-License-Identifier: MIT
// https://smartcontractshacking.com/#copyright-policy
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {rToken} from "./rToken.sol";

/**
 * @title TokensDepository
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract TokensDepository {
    
    mapping(address => IERC20) public tokens;
    mapping(address => rToken) public baseToReceipt;

    // TODO: Complete this contract functionality

    modifier supportedToken(address _token) {
        require(_token != address(0));
        _;
    }

    constructor(address _aave, address _uni, address _weth) {
        tokens[_aave] = IERC20(_aave);
        tokens[_uni] = IERC20(_uni);
        tokens[_weth] = IERC20(_weth);

        baseToReceipt[_aave] = new rToken(_aave, "Receipt AAVE", "rAave");
        baseToReceipt[_uni] = new rToken(_uni, "Receipt UNI", "rUni");
        baseToReceipt[_weth] = new rToken(_weth, "Receipt WETH", "rWeth");
    }

    function deposit(uint256 _amount, address _token) external supportedToken(_token){
        rToken receipt = baseToReceipt[_token];
        IERC20 token = IERC20(_token);

        //token.approve(address(this), _amount); approval is meant to happen in tests
        token.transferFrom(msg.sender, address(this), _amount);
        receipt.mint(_amount, msg.sender);
    }

    function withdraw(uint256 _amount, address _token) external supportedToken(_token) {
        rToken receipt = baseToReceipt[_token];
        IERC20 token = IERC20(_token);
        
        receipt.burn(_amount, msg.sender);
        token.transfer(msg.sender, _amount);
    }
}
