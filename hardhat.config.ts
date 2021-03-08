import "@nomiclabs/hardhat-waffle"
import '@typechain/hardhat';
import "hardhat-jest-plugin";

import { HardhatUserConfig } from "hardhat/types";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [{ version: "0.7.3", settings: {} }]
  }
};

export default config
