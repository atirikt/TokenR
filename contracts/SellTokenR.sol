pragma solidity >=0.4.22 <0.9.0;

import "./TokenR.sol";

contract SellTokenR{
	address admin;
	TokenR public tokenContract;
	uint256 public tokenPrice;

	constructor(TokenR _tokenContract, uint256 _tokenPrice) public{
		admin = msg.sender;
		tokenContract = _tokenContract;
		tokenPrice = _tokenPrice;
	}
}
