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

	constructor(uint256 _initialSupplyXe16) public{
		balanceOf[msg.sender] = _initialSupplyXe16;
		totalSupply = _initialSupplyXe16;
	}

	//_value in wei format(x 1e18) : price of 100 TokenR = 1 ether
	// therefore 100*1e16 _value = 1 ether = 1e18 wei
	// therefore 1 _value = 1 wei 
	function transfer(address _to, uint256 _valueXe16) public returns(bool success){
		require(balanceOf[msg.sender] >= _valueXe16, "balance is not enough");
		balanceOf[msg.sender] -= _valueXe16;
		balanceOf[_to] += _valueXe16;
		emit Transfer(msg.sender, _to, _valueXe16);
		return true;
	}

	function approve (address _spender, uint256 _valueXe16) public returns(bool success){
		allowance[msg.sender][_spender] = _valueXe16;
		emit Approval(msg.sender, _spender, _valueXe16);
		return true;		
	}
	
	function transferFrom(address _from, address _to, uint256 _valueXe16) public returns(bool success){

		require(balanceOf[_from]>=_valueXe16, "balance less of source account");
		require(allowance[_from][msg.sender]>=_valueXe16, "transfer value higher than approved");
		allowance[_from][msg.sender] -= _valueXe16;
		balanceOf[_from] -= _valueXe16;
		balanceOf[_to] += _valueXe16;
		emit Transfer(_from, _to, _valueXe16);
		return true;
	}

}