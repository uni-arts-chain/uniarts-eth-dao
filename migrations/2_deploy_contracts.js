/* eslint-env node */
/* global artifacts */

const Marketplace = artifacts.require('core/Marketplace');
const TrustMarketplace = artifacts.require('core/TrustMarketplace');
const ResellMarketplace = artifacts.require('core/ResellMarketplace');
const UniArtsNFT = artifacts.require('ERC721/UniArtsNFT');
const USDT = artifacts.require('ERC20/USDT');
const Auction = artifacts.require('core/Auction');
const TokenLockerStorage = artifacts.require('core/TokenLockerStorage');

function deployContracts(deployer) {
  deployer.deploy(Marketplace);
  deployer.deploy(ResellMarketplace);
  deployer.deploy(UniArtsNFT, '0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac');
  deployer.deploy(USDT).then(function() {
    deployer.deploy(Auction, USDT.address);
    return deployer.deploy(TrustMarketplace, USDT.address);
  });
  deployer.deploy(TokenLockerStorage);
}

module.exports = deployContracts;
