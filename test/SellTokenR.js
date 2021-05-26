var SellTokenR = artifacts.require('./SellTokenR.sol');

contract('SellTokenR', function(accounts){

  var tokenSellObj;
  var tokenPrice = 1e16; //in wei, 100 TokenR = 1 ether
  it('initializes contract correctly',function(){
    return SellTokenR.deployed().then(function(Obj){
      tokenSellObj = Obj;
      return tokenSellObj.address;
    }).then(function(address){
      assert.notEqual(address, 0x0, 'account has ok value');
      return tokenSellObj.tokenContract();
    }).then(function(address){
      assert.notEqual(address, 0x0, 'token contract ok');
      return tokenSellObj.tokenPrice();
    }).then(function(price){
      //assert.equal(price, tokenPrice, 'token price ok');
    })
  })




})