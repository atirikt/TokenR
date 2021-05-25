pragma solidity >=0.4.22 <0.9.0;

contract TokenR{
	
	string public  name = "TokenR";
	uint256 public totalSupply;
	string public symbol = 'TkR';
	string public version = '0.0.0';
	mapping (address=>mapping(address=>uint256)) public allowance;

	event Transfer(
		address indexed _from,
		address indexed _to,
		uint256 _value
	);

	event Approval(
		address indexed _owner,
		address indexed _spender,
		uint256 _value
	);

	mapping(address => uint256) public balanceOf;

	constructor(uint256 _initialSupply) public{
		balanceOf[msg.sender] = _initialSupply;
		totalSupply = _initialSupply;
	}

	function transfer(address _to, uint256 _value) public returns(bool success){
		require(balanceOf[msg.sender] >= _value, "balance is not enough");
		balanceOf[msg.sender] -= _value;
		balanceOf[_to] += _value;
		emit Transfer(msg.sender, _to, _value);
		return true;
	}

	function approve (address _spender, uint256 _value) public returns(bool success){
		allowance[msg.sender][_spender] = _value;
		emit Approval(msg.sender, _spender, _value);
		return true;		
	}
	

}