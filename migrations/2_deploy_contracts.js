const TokenR = artifacts.require("TokenR");
const SellTokenR = artifacts.require("SellTokenR");

module.exports = function (deployer) {
  deployer.deploy(TokenR, 1e7).then(function(){
      //100 TokenR = 1 ether
      tokenPrice = 1e16;
      return deployer.deploy(SellTokenR, TokenR.address, web3.utils.toBN(tokenPrice));
  });
};
