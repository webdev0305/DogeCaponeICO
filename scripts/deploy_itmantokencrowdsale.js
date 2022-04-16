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
  
  // const marketingAddress = '0x8c013b61dba6de1e6a8af25ed6a78212182af2bf'
  // const devAddress = '0x3d4912634535080e95dd3994d800c6156dda30db'
  // // // We get the contract to deploy
  // const Token = await ethers.getContractFactory("DogeCaponecoin");
  // const token = await Token.deploy(marketingAddress, devAddress);

  // await token.deployed();
  // console.log("Token deployed to:", token.address);

  // // deploy crowdsale contract
  const TokenCrowdsale = await ethers.getContractFactory("Crowdsale");
  const rate = 500; // 500 wei per token
  const tokenCrowdsale = await TokenCrowdsale.deploy(
    rate,
    '0x84cAE31E38Dc2f7932a725Da6daE87f732635974',
    '0x53a8e10b2dF99Bc00764Fa94c35C6AD77F8B4eB8',
  );

  await tokenCrowdsale.deployed();
  console.log("tokenCrowdsale deployed to:", tokenCrowdsale.address);

  // await (await tokenCrowdsale.updateToken(token.address)).wait()
  // await(await tokenCrowdsale.updateWallet(owner.address)).wait()
  // await(await tokenCrowdsale.updateRate(1000)).wait()
  // transfer tokens to crowdsale contract
  // await (await token.transfer(tokenCrowdsale.address, ethers.utils.parseEther("50000"))).wait()
  // console.log((await token.balanceOf(tokenCrowdsale.address)).toString())
  // // token transfer enalbe
  // const tokenCrowdsale = ethers.getContractAt("Crowdsale","0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512")
  // await (await tokenCrowdsale.setEnableTransferToken(true)).wait()

//  const tokenCrowdsale = await ethers.getContractAt("Crowdsale","0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512")
//   await (await tokenCrowdsale.setEnableTransferToken(true)).wait()
  // console.log(await latestTime())
  //   await network.provider.send("evm_increaseTime", [1000 * 60]);
  //   await network.provider.send("evm_mine");
  //   console.log(await latestTime())
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
