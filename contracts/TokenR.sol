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

	constructor(uint256 _initialSupplyInWei) public{
		balanceOf[msg.sender] = _initialSupplyInWei;
		totalSupply = _initialSupplyInWei;
	}

	function transfer(address _to, uint256 _valueInWei) public returns(bool success){
		require(balanceOf[msg.sender] >= _valueInWei, "balance is not enough");
		balanceOf[msg.sender] -= _valueInWei;
		balanceOf[_to] += _valueInWei;
		emit Transfer(msg.sender, _to, _valueInWei);
		return true;
	}

	function approve (address _spender, uint256 _valueInWei) public returns(bool success){
		allowance[msg.sender][_spender] = _valueInWei;
		emit Approval(msg.sender, _spender, _valueInWei);
		return true;		
	}
	
	function transferFrom(address _from, address _to, uint256 _valueInWei) public returns(bool success){

		require(balanceOf[_from]>=_valueInWei, "balance less of source account");
		require(allowance[_from][msg.sender]>=_valueInWei, "transfer value higher than approved");
		allowance[_from][msg.sender] -= _valueInWei;
		balanceOf[_from] -= _valueInWei;
		balanceOf[_to] += _valueInWei;
		emit Transfer(_from, _to, _valueInWei);
		return true;
	}

}