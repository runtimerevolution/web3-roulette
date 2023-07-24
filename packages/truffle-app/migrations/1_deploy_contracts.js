const Giveaways = artifacts.require("Giveaways");

module.exports = function(deployer) {
  deployer.deploy(Giveaways);
};
