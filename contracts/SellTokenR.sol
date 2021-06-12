pragma solidity >=0.4.22 <0.9.0;

import "./TokenR.sol";

contract SellTokenR{
	address payable admin;
	TokenR public tokenContract;
	uint256 public tokenPrice;
	uint256 public tokenSold;

	event TokenBuy(
		address _buyer,
		uint256 _numberOfTokens
	);

	event TokenSell(
		address _seller,
		uint256 _numOfTokens
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

	function IsAdmin(address inputAddress) public view returns(bool){
		return (inputAddress == admin);
	}

	function buyTokens (uint256 _numOfTokens) public payable {
		//trigger sell event
		require(msg.value == multiply(_numOfTokens, tokenPrice), 'less wei sent for the specified tokens');
		require(tokenContract.balanceOf(address(this)) >= _numOfTokens, 'sell contract does not have these many tokens');
		require(tokenContract.transfer(msg.sender, _numOfTokens) == true, 'token buy executed');

		tokenSold += _numOfTokens;
		emit TokenBuy(msg.sender, _numOfTokens);
	}

	function sellTokens(uint256 _numOfTokens) public  {
		require(tokenContract.balanceOf(msg.sender) >= _numOfTokens, 'not enough tokens');
		require(address(this).balance >= _numOfTokens * 1e10, 'contract does not have enough eth in balance for which user wants to sell');

		//send tokens from msg.sender to address(this)
		tokenContract.remit(address(this), _numOfTokens);
		msg.sender.transfer(_numOfTokens * 1e10); //transfer wei
		emit TokenSell(msg.sender, _numOfTokens);
	}
	
	function endSell() onlyAdmin public{
		//transfer amount of wei and tokens from contract to admin
		admin.transfer(address(this).balance);
		require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))));
		selfdestruct(admin);
	}
}
