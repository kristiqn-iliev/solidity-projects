//SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

contract EtherWallet {

    address public owner;

    event EtherReceived(uint256 value,  bytes data, address from);
    event DataReceived(bytes data, address from);
    event EtherSent(uint256 value, bytes data, address to, bool success);

    modifier OnlyOwner() {
        require(owner == msg.sender, "unauthorized sender");
        _;
    }
    constructor() payable{
        owner = msg.sender;
    }

    function send(uint256 _value, address _to) OnlyOwner external{
        (bool success, bytes memory data) = _to.call{value: _value}("");
        emit EtherSent(_value, data, _to, success);
    }
    fallback() external{
        emit DataReceived(msg.data, msg.sender);
    }

    receive() payable external{
        emit EtherReceived(msg.value, "", msg.sender);
    }
}