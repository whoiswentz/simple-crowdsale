import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { ethers } from "hardhat"
import { SimpleCrowdsale, SimpleCrowdsale__factory } from "../typechain"

describe('SimpleCrowdSale Test', () => {
    let contract: SimpleCrowdsale

    const startDate = new Date()
    const endDate = new Date(startDate.setMonth(startDate.getMonth() + 1))

    let owner: SignerWithAddress
    let addr1: SignerWithAddress

    beforeEach(async () => {
        [owner, addr1] = await ethers.getSigners()
        contract = await new SimpleCrowdsale__factory(owner).deploy(
            startDate.getTime(), endDate.getTime(), 1, 1)
    })

    describe('#constructor', () => {
        test('should successfully deploy the contract', async () => {
            expect(contract).toBeDefined()
        })
    })

    describe('#invest', () => {
        test('should fail, because the investment isn\'t valid', async () => {
            try {
                await contract.connect(addr1).invest({ value: 0 })
            } catch (error) {
                expect(error).not.toBeUndefined()
            }
        })

        test('should invest a certain amount of ether', async () => {
            try {
                await contract.connect(addr1).invest({ value: 10000000 })
            } catch (error) {
                console.log(error)
            }
        })
    })
})