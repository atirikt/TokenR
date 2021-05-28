pragma solidity >=0.4.22 <0.9.0;

import "./TokenR.sol";

contract SellTokenR{
	address payable admin;
	TokenR public tokenContract;
	uint256 public tokenPrice;
	uint256 public tokenSold;

	event TokenSell(
		address _buyer,
		uint256 _numberOfTokens
	);
	
	constructor(TokenR _tokenContract, uint256 _tokenPrice) public{
		admin = msg.sender;
		tokenContract = _tokenContract;
		tokenPrice = _tokenPrice;
	}

	modifier onlyAdmin(){
		require (msg.sender == admin, 'account not authorised to end sale.');
		_;
	}

	function multiply(uint x, uint y) internal pure returns(uint z){
		require(y == 0 || (z = x * y) / y == x);
	}

	function buyTokens (uint256 _numOfTokens) public payable {
		//trigger sell event
		require(msg.value == multiply(_numOfTokens, tokenPrice), 'less wei sent for the specified tokens');
		require(tokenContract.balanceOf(address(this)) >= _numOfTokens, 'sell contract does not have these many tokens');
		require(tokenContract.transfer(msg.sender, _numOfTokens) == true, 'token buy executed');

		tokenSold += _numOfTokens;
		emit TokenSell(msg.sender, _numOfTokens);
	}
	
	function endSell() onlyAdmin public{
		//transfer amount of tokens from contract to admin
		require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))));
		selfdestruct(admin);
	}
}
