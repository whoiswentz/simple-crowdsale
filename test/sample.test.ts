import { ethers } from 'hardhat';
import {expect} from 'chai'
import { Contract } from '@ethersproject/contracts';

describe("Greeter", () => {
  let contract: Contract

  before(async () => {
    const Greeter = await ethers.getContractFactory("Greeter");
    contract = await Greeter.deploy("Hello, world!");
  })

  it("Should return the new greeting once it's changed", async () => {
    expect(await contract.greet()).to.equal("Hello, world!");

    await contract.setGreeting("Hola, mundo!");
    expect(await contract.greet()).to.equal("Hola, mundo!");
  });
});
