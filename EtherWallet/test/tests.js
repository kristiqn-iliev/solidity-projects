const { ethers } = require('hardhat')
const { expect } = require('chai')

console.log("sh");

describe('EtherWallet hardhat tests', function () {

    console.log("sh");
    const DEPLOYER_MINT = ethers.parseEther('100000');
    const FIRST_TRANSACTION = ethers.parseEther('20000');
    const SECOND_TRANSACTION = ethers.parseEther('45000');
    const THIRD_TRANSACTION = ethers.parseEther('1000000');

    const INITIAL_BALANCE_USER1 = ethers.parseEther('800');
    const INITIAL_BALANCE_USER2 = ethers.parseEther('1000');
    
    before(async function() {

        [user1, user2] = await ethers.getSigners();
        const WalletFactory = await ethers.getContractFactory("contracts/EtherWallet.sol:EtherWallet");
        this.instance1 = await WalletFactory.deploy({value: INITIAL_BALANCE_USER1});
        this.instance2 = await WalletFactory.deploy({value: INITIAL_BALANCE_USER2});

    });

    it('ctest', async function() {

        console.log("..", user1.address);
        console.log("..", this.instance1.address);
    });
});
//не работят както трябва, но ги оставям засега така, защото твърде много време ми отнема да се занимавам с boilerplate