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
      assert.equal(receipt.logs[0].args._to, accounts[1], 'dest account ok');
      assert.equal(receipt.logs[0].args._value, 250000, 'val account ok');
      
      return tokenObj.balanceOf(accounts[1]);
    }).then(function(balance){
      assert.equal(balance.toNumber(), 250000, 'amount added ok');
      return tokenObj.balanceOf(accounts[0]);
    }).then(function(balance){
      assert.equal(balance.toNumber(), 1e7-250000, 'deduction ok');
    });
  })

  it('sets up delegated transfer', function(){
    return TokenR.deployed().then(function(Obj){
      tokenObj =Obj;
      return tokenObj.approve.call(accounts[1], 100);
    }).then(function(success){
      assert.equal(success, true, 'returns true ok');
      return tokenObj.approve(accounts[1], 100,{from:accounts[0]});
    }).then(function(receipt){
      assert.equal(receipt.logs[0].args._owner, accounts[0], 'source account ok');
      assert.equal(receipt.logs[0].args._spender, accounts[1], 'dest account ok');
      assert.equal(receipt.logs[0].args._value, 100, 'val account ok');
      return tokenObj.allowance(accounts[0], accounts[1]);
    }).then(function(_value){
      assert.equal(_value.toNumber(), 100, 'value ok');
    })
  })

  it('handles delegated transfer', function(){
    return TokenR.deployed().then(function(Obj){
      tokenObj = Obj;
      from_ =accounts[5];
      to = accounts[6];
      delegated = accounts[7];
      return tokenObj.transfer(from_, 1000, {from:accounts[0]});
    }).then(function(receipt){
      return tokenObj.approve(delegated, 100, {from:from_});
    }).then(function(receipt){
      return tokenObj.transferFrom(from_, to, 20, {from:delegated});
    }).then(function(receipt){
      return tokenObj.balanceOf(to);
    }).then(function(balance){
      assert.equal(balance.toNumber(), 20, 'delegated ok');
      return (tokenObj.allowance(from_, delegated)); 
    }).then(function(balance){
      assert.equal(balance.toNumber(), 80, 'left allowance ok');
      return tokenObj.balanceOf(from_);
    }).then(function(balance){
      assert.equal(balance.toNumber(), 980, 'left source balance ok');
      return tokenObj.transferFrom(from_, to, 400, {from:delegated});
    }).then(assert.fail).catch(function(error){
      assert(error.message.indexOf('revert') >= 0,'cannot transfer value larger than allowance');
      return tokenObj.approve(delegated, 10000, {from:from_});
    }).then(function(receipt){
      return tokenObj.allowance(from_, delegated);
    }).then(function(balance){
      assert.equal(balance.toNumber(), 10000, 'additional approval ok');
      return tokenObj.transferFrom(from_, to, 5000, {from:delegated});
    }).then(assert.fail).catch(function(error){
      assert(error.message.indexOf('revert') >= 0, "cannot transfer more than source balance");
      return tokenObj.transferFrom(from_, to, 500, {from:delegated});
    }).then(function(receipt){
      return tokenObj.balanceOf(to);
    }).then(function(balance){
      assert.equal(balance.toNumber(), 520, 'readd ok');
      return tokenObj.allowance(from_, delegated);
    }).then(function(balance){
      assert.equal(balance.toNumber(), 9500, 'allowance ok after readd');
      return tokenObj.balanceOf(from_);
    }).then(function(balance){
      assert.equal(balance.toNumber(), 480, 'source balance ok after readd');
      return tokenObj.transferFrom(from_, to, 10, {from:delegated});
    }).then(function(receipt){
      assert.equal(receipt.logs[0].args._from, from_, 'source account ok');
      assert.equal(receipt.logs[0].args._to, to, 'dest account ok');
      assert.equal(receipt.logs[0].args._value, 10, 'val account ok');
    })
  });


  });