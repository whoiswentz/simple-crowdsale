import "@nomiclabs/hardhat-waffle"
import '@typechain/hardhat';
import "hardhat-jest-plugin";

import { HardhatUserConfig } from "hardhat/types";
import { task } from "hardhat/config";

task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    const balance = await account.getBalance()
    console.log(account.address, await balance.toString());
  }
});

const config: HardhatUserConfig = {
  solidity: {
    compilers: [{ version: "0.7.3", settings: {} }]
  }
};

export default config
