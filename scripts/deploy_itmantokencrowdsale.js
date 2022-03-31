// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
// eslint-disable-next-line import/no-extraneous-dependencies
const { ethers } = require("hardhat");

async function latestTime() {
  const block = await ethers.provider.getBlock("latest");
  return block.timestamp;
}

const duration = {
  seconds(val) {
    return val;
  },
  minutes(val) {
    return val * this.seconds(60);
  },
  hours(val) {
    return val * this.minutes(60);
  },
  days(val) {
    return val * this.hours(24);
  },
  weeks(val) {
    return val * this.days(7);
  },
  years(val) {
    return val * this.days(365);
  },
};

async function main() {
  // const [owner, addr1, addr2, addr3, addr4] = await ethers.getSigners();
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');
  // const marketingAddress = '0x8c013b61dba6de1e6a8af25ed6a78212182af2bf'
  // const devAddress = '0x3d4912634535080e95dd3994d800c6156dda30db'
  // // We get the contract to deploy
  // const Token = await ethers.getContractFactory("DogeCaponecoin");
  // const token = await Token.deploy(marketingAddress, devAddress);

  // await token.deployed();
  // console.log("Token deployed to:", token.address);
  // const totalSupply = await token.totalSupply();
  // console.log("Total Supply", totalSupply);

  // // deploy crowdsale contract
  const TokenCrowdsale = await ethers.getContractFactory("Crowdsale");
  const rate = 500; // 500 wei per token
  const tokenCrowdsale = await TokenCrowdsale.deploy(
    rate,
    '0x49c3Ea488e4F57e91b0aB002A16107f2A5EAD07d',
    '0x8E17f94dA2Bfaf70991A4a80bc153931a8026025',
  );

  await tokenCrowdsale.deployed();
  console.log("tokenCrowdsale deployed to:", tokenCrowdsale.address);
  // // console.log(Number(await token.totalSupply()))

  // await (await tokenCrowdsale.updateToken(token.address)).wait()
  // await(await tokenCrowdsale.updateWallet(owner.address)).wait()
  await(await tokenCrowdsale.updateRate(1000)).wait()
  // transfer tokens to crowdsale contract
  await (await token.transfer(tokenCrowdsale.address, ethers.utils.parseEther("50000"))).wait()
  console.log(await token.balanceOf(tokenCrowdsale.address))
  // approve crowdsale contract to spend 70% tokens
  
  // await token.approve(
  //   tokenCrowdsale.address,
  //   ethers.utils.parseEther("50000")
  //   // totalSupply.mul(ethers.BigNumber.from(70)).div(ethers.BigNumber.from(100))
  // );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
