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

  it('transfer tokenR', function(){
    return TokenR.deployed().then(function(Obj){
      tokenObj = Obj;
      return tokenObj.transfer.call(accounts[1], 1e10);
    }).then(assert.fail).catch(function(error){
      assert(error.message.indexOf('revert') >= 0, 'error must contain revert');
      return tokenObj.transfer.call(accounts[1], 250000, {from:accounts[0]});
    }).then(function(success){
      assert.equal(success, true, 'transfer returns true');
      return tokenObj.transfer(accounts[1],250000, {from: accounts[0]});
    }).then(function(receipt){
      assert.equal(receipt.logs[0].args._from, accounts[0], 'source account ok');
      assert.equal(receipt.logs[0].args._to, accounts[1], 'source account ok');
      assert.equal(receipt.logs[0].args._value, 250000, 'source account ok');
      
      return tokenObj.balanceOf(accounts[1]);
    }).then(function(balance){
      assert.equal(balance.toNumber(), 250000, 'amount added ok');
      return tokenObj.balanceOf(accounts[0]);
    }).then(function(balance){
      assert.equal(balance.toNumber(), 1e7-250000, 'deduction ok');
    });
  })

  it('delegated transfer', function(){
    return TokenR.deployed().then(function(Obj){
      tokenObj =Obj;
      return tokenObj.approve.call(accounts[1], 100);
    }).then(function(success){
      assert.equal(success, true, 'returns true ok');
      return tokenObj.approve(accounts[1], 100,{from:accounts[0]});
    }).then(function(receipt){
      assert.equal(receipt.logs[0].args._owner, accounts[0], 'source account ok');
      assert.equal(receipt.logs[0].args._spender, accounts[1], 'source account ok');
      assert.equal(receipt.logs[0].args._value, 100, 'source account ok');
      return tokenObj.allowance(accounts[0], accounts[1]);
    }).then(function(_value){
      assert.equal(_value.toNumber(), 100, 'value ok');
    })
  })













  });