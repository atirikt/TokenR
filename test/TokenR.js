//mocha and chai
const TokenR = artifacts.require("./TokenR.sol");

contract("TokenR", function(accounts){


  it('init contract check',function(){
    var tokenObj;
    return TokenR.deployed().then(function(Obj){
      tokenObj = Obj;
      return tokenObj.name();
    }).then(function(name){
      assert.equal(name, 'TokenR', 'name ok');
      return tokenObj.symbol();
    }).then(function(symbol){
      assert.equal(symbol, 'TkR', 'name ok');
      return tokenObj.version();
    }).then(function(version){
      assert.equal(version, "0.0.0", 'version matches with test');
    });
  });

  it('check total supply', function() {
    return TokenR.deployed().then(function(Obj) {
      tokenObj = Obj;
      return tokenObj.totalSupply();
    }).then(function(totalSupply){
      assert.equal(totalSupply.toNumber(), 1e7, 'total supply is 10 m');
      return tokenObj.balanceOf(accounts[0]);
    }).then(function(adminBalance){
      assert.equal(adminBalance.toNumber(), 1e7, "allocated initial supply to to admin")
    });
    });
  });