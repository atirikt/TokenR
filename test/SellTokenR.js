var TokenR = artifacts.require('./TokenR.sol');
var SellTokenR = artifacts.require('./SellTokenR.sol');

contract('SellTokenR', function(accounts){

  var tokenSellObj;
  var tokenObj;
  var tokenPrice = 1e10; //in wei, 1 TokenR = 1 ether
  var admin = accounts[0];
  var buyer = accounts[1];
  var numberOfTokens;
  var tokensAvailable = 5e14; //50% of supply
  let AdminBalance;


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
      assert.equal(price, tokenPrice, 'token price ok');
    })
  })

  it('facilitates token buying', function(){
    return TokenR.deployed().then(function(Obj){
      tokenObj = Obj;
      return SellTokenR.deployed();
    }).then(function(Obj){
      tokenSellObj = Obj;
      //provision to add 50% to contract
      return tokenObj.transfer(tokenSellObj.address, tokensAvailable, { from: admin });
    }).then(function(receipt){
      return tokenObj.balanceOf(tokenSellObj.address);
    }).then(function(amount){
      assert.equal(amount, tokensAvailable, 'available tokens transferred to contract');
      numberOfTokens = 1e9; //10 TokenR
      var value =  numberOfTokens * tokenPrice;
      return tokenSellObj.buyTokens(numberOfTokens, {from: buyer, value: value})
    }).then(function(receipt){
      assert.equal(receipt.logs.length, 1, 'length event ok');
      assert.equal(receipt.logs[0].event, 'TokenSell', 'sell event ok');
      assert.equal(receipt.logs[0].args._buyer, accounts[1], 'dest account ok');
      assert.equal(receipt.logs[0].args._numberOfTokens, numberOfTokens, 'val account ok');
      return tokenSellObj.tokenSold();
    }).then(function(amount){
      assert.equal(amount.toNumber(), numberOfTokens, 'number of tokens sold ok')
      return tokenSellObj.buyTokens(numberOfTokens, {from: buyer, value: 1}); // ridiculously low price, try to purchase 10 TokenR for 1 Wei
    }).then(assert.fail).catch(function(error){
      assert(error.message.indexOf('revert') >=0, 'wei provided for tokens less');
      return tokenSellObj.buyTokens(6e14, {from: buyer, value: 24});
    }).then(assert.fail).catch(function(error){
      assert(error.message.indexOf('revert') >= 0, 'contract does not have these many tokens');
      return tokenObj.balanceOf(tokenSellObj.address);
    }).then(function(amount){
      assert.equal(amount.toNumber(), tokensAvailable - 1e9, 'amount left in contract ok');
      return tokenObj.balanceOf(buyer);
    }).then(function(amount){
      assert.equal(amount.toNumber(), 1e9, 'amount in buyer account ok');
    })
  })

  it('check eth/wei balance before end.',async function(){
    AdminBalanceInit = await web3.eth.getBalance(admin);
    let sellContractBalance = await web3.eth.getBalance(tokenSellObj.address);
    //console.log(sellContractBalance +'\n'+ AdminBalance);
  })


  it('end the selling', function(){
    return TokenR.deployed().then(function(Obj){
      tokenObj = Obj;
      return SellTokenR.deployed();
    }).then(function(Obj){
      tokenSellObj = Obj;
      return tokenSellObj.endSell({from: accounts[1]});
    }).then(assert.fail).catch(function(error){
      assert(error.message.indexOf('revert') >= 0, 'account is not admin')
      return tokenSellObj.endSell({from:admin});
    }).then(function(receipt){
      //console.log(receipt);
      return tokenObj.balanceOf(admin);
    }).then(function(balance){
      //console.log(balance.toNumber());
      assert.equal(balance.toNumber(), 999999000000000, "balance of admin ok"); //10 TokenR deducted
      return tokenSellObj.tokenPrice();
    }).then(assert.fail).catch(function(error){
      assert(error.message.indexOf('not using the correct ABI') >=0, 'the contract is destroyed, DO NOT INTERACT with it');
    })
  })

  it('check eth/wei balance after end.',async function(){
    let AdminBalance = await web3.eth.getBalance(admin);
    let sellContractBalance = await web3.eth.getBalance(tokenSellObj.address);
    //console.log(sellContractBalance+'\n' + AdminBalance);
    assert.equal(sellContractBalance, 0, 'destroyed contract balance is 0');
    //not checking admin balance as the value expected is higher than supported by js
    //var AdminBalanceN = web3.utils.toBN(AdminBalance);
    //var AdminBalanceInitN = web3.utils.toBN(AdminBalanceInit);
    //assert.isAbove(AdminBalanceN.toNumber(), AdminBalanceInitN.toNumber(), 'admin balance updated after sell');
  })


})
