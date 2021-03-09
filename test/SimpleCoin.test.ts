import { TransactionDescription } from "@ethersproject/abi"
import { BigNumber } from "@ethersproject/bignumber"
import { Contract, ContractFactory } from "@ethersproject/contracts"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { ethers } from "hardhat"

describe('SimpleCoint', () => {
    let SimpleCoin: ContractFactory
    let contract: Contract

    let owner: SignerWithAddress
    let addr1: SignerWithAddress
    let addr2: SignerWithAddress

    beforeEach(async () => {
        [owner, addr1, addr2] = await ethers.getSigners()
        SimpleCoin = await ethers.getContractFactory('SimpleCoin')
        contract = await SimpleCoin.deploy(1000)
    })

    describe('Deployment', () => {
        test('should be deployed successfuly', async () => {
            expect(contract).toBeDefined()
        })

        test('should be deployed on the owner address', async () => {
            const contractOwner = await contract.owner();
            const ownerAddress = owner.address

            expect(contractOwner).toEqual(ownerAddress)
        })
    })

    describe('Tranfer', () => {
        test('should\'t transfer because sender doesn\'t have coinBalance', async () => {
            let addr2Balance: BigNumber = BigNumber.from("0")

            try {
                await contract.connect(addr1).transfer(addr2.address, 100000)
                addr2Balance = await contract.coinBalance(addr2.address)
            } catch (error) {
                expect(addr2Balance.toNumber()).not.toEqual(100000)
            }
        })

        test('should transfer because sender have the amount to', async () => {
            let addr2Balance: BigNumber = BigNumber.from("0")

            await contract.connect(owner).transfer(addr2.address, 10)
            addr2Balance = await contract.coinBalance(addr2.address)

            expect(addr2Balance.toNumber()).toEqual(10)

            // Asserting the emmited event
            //expect(tx.from).toEqual(owner.address)
            //expect(tx.to).toEqual(addr2.address)
            //expect(tx.value.toNumber()).toEqual(10)
        })
    })
})