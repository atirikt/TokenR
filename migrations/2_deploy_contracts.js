const TokenR = artifacts.require("TokenR");

module.exports = function (deployer) {
  deployer.deploy(TokenR, 1e7);
};
