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
    let addr3: SignerWithAddress

    beforeEach(async () => {
        [owner, addr1, addr2, addr3] = await ethers.getSigners()
        SimpleCoin = await ethers.getContractFactory('SimpleCoin')
        contract = await SimpleCoin.deploy(1000000)
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

    describe('Allowance', () => {
        test('should give allowance to addr2 through addr1', async () => {
            await contract.connect(addr1).authorize(addr2.address, 1000)

            const allowance = await contract.allowance(addr1.address, addr2.address)
            const allowanceAmmount = await allowance.toNumber()

            expect(allowanceAmmount).toEqual(1000)
        })

        test('should permit addr2 transfer from addr1 to addr3', async () => {
            await contract.connect(owner).transfer(addr1.address, 1000)
            await contract.connect(owner).transfer(addr2.address, 1000)
            await contract.connect(owner).transfer(addr3.address, 1000)

            await contract.connect(addr1).authorize(addr2.address, 1000)

            const allowance = await contract.allowance(addr1.address, addr2.address)
            const allowanceAmmount = await allowance.toNumber()

            expect(allowanceAmmount).toEqual(1000)

            await contract.connect(addr2).transferFrom(addr1.address, addr3.address, 100)

            const allowanceAddr1Addr2 = await contract.allowance(addr1.address, addr2.address)
            const allowanceAddr1Addr2Ammount = await allowanceAddr1Addr2.toNumber()       

            expect(allowanceAddr1Addr2Ammount).toEqual(900)

            const addr3Balance = await contract.coinBalance(addr3.address)
            const addr3BalanceAmount = await addr3Balance.toNumber()

            expect(addr3BalanceAmount).toEqual(1100)
        })
    })
})