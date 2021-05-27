const TokenR = artifacts.require("TokenR");
const SellTokenR = artifacts.require("SellTokenR");

module.exports = function (deployer) {
  //there are 10m TokenR, 1e8 is a multiplier for decimal transactions.
  deployer.deploy(TokenR, 1e15).then(function(){
      //1 TokenR = 1 ether, 1e8 subToken(after multiplier) = 1 eth, 1 subToken = 1e-8 eth or 1e10 wei 
      tokenPrice = 1e10; //wei
      return deployer.deploy(SellTokenR, TokenR.address, web3.utils.toBN(tokenPrice));
  });
};
