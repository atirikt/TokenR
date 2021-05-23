pragma solidity >=0.4.22 <0.9.0;

contract TokenR{
	
	string public  name = "TokenR";
	uint256 public totalSupply;
	string public symbol = 'TkR';
	string public version = '0.0.0';
	
	mapping(address => uint256) public balanceOf;

	constructor(uint256 _initialSupply) public{
		balanceOf[msg.sender] = _initialSupply;
		totalSupply = _initialSupply;
	}
}