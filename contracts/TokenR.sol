pragma solidity >=0.4.22 <0.9.0;

contract TokenR{
	
	string public  name = "TokenR";
	uint256 public totalSupply;
	string public symbol = 'TkR';
	string public version = '0.0.0';
	mapping (address=>mapping(address=>uint256)) public allowance;
	address public sellTokenRAddress = "0x0";

	event Transfer(
		address indexed _from,
		address indexed _to,
		uint256 _value
	);

	event Remit(
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

    //initial supply 1e7 * multiplier 1e8
    //1 TokenR = 1eth
    //1e8 subTokenR = 1e18 wei
    //1 subTokenR = 1e10 Wei
	constructor(uint256 _initialSupply) public{
		//initialSupply of subTokenR
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

	function updateSellContractAddress(address _sellTokenR) public onlyAdmin(msg.sender){
		sellTokenRAddress = _sellTokenR;
	}

	//for selling of tokens from TokenRSell contract
	function remit (address _to, uint256 _value) public returns(bool success){
		require(msg.sender == sellTokenRAddress, "only Sell contract calls remit")
		require(balanceOf[tx.origin]>=_value, "balance less of source account");
		balanceOf[tx.origin] -= _value;
		balanceOf[_to] += _value;
		emit Remit(tx.origin, _to, _value);
		return true;
	}

	function approve (address _spender, uint256 _value) public returns(bool success){
		allowance[msg.sender][_spender] = _value;
		emit Approval(msg.sender, _spender, _value);
		return true;		
	}

	function transferFrom(address _from, address _to, uint256 _value) public returns(bool success){

		require(balanceOf[_from]>=_value, "balance less of source account");
		require(allowance[_from][msg.sender]>=_value, "transfer value higher than approved");
		allowance[_from][msg.sender] -= _value;
		balanceOf[_from] -= _value;
		balanceOf[_to] += _value;
		emit Transfer(_from, _to, _value);
		return true;
	}

}