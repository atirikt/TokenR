//mocha and chai
const TokenR = artifacts.require("./TokenR.sol");

contract("TokenR", function(accounts){

  it('check total supply', function() {
    return TokenR.deployed().then(function(Obj) {
      tokenObj = Obj;
      return tokenObj.totalSupply();
    }).then(function(totalSupply){
      assert.equal(totalSupply.toNumber(), 1e7, 'total supply is 10 m');
    });
  });

})