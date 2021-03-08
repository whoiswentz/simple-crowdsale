import "@nomiclabs/hardhat-waffle"
import '@typechain/hardhat';

import { HardhatUserConfig } from "hardhat/types";

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config: HardhatUserConfig = {
  solidity: {
    compilers: [{ version: "0.7.3", settings: {} }]
  }
};

export default config
