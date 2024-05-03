const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('ERC20 Tokens Exercise 2', function () {
  
  let deployer;

  const AAVE_ADDRESS = "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9"
  const UNI_ADDRESS = "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984"
  const WETH_ADDRESS = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"

  const AAVE_HOLDER = "0x2efb50e952580f4ff32d8d2122853432bbf2e204";
  const UNI_HOLDER = "0x193ced5710223558cd37100165fae3fa4dfcdc14";
  const WETH_HOLDER = "0x741aa7cfb2c7bf2a1e7d4da2e3df6a56ca4131f3";

  const ONE_ETH = ethers.utils.parseEther('1');

  before(async function () {
    /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

    [deployer] = await ethers.getSigners();

    // Load tokens mainnet contracts
    this.aave = await ethers.getContractAt(
      "@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20",
      AAVE_ADDRESS
    );
    this.uni = await ethers.getContractAt(
      "@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20",
      UNI_ADDRESS
    );
    this.weth = await ethers.getContractAt(
      "@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20",
      WETH_ADDRESS
    );

    // Load holders (accounts which hold tokens on Mainnet)
    this.aaveHolder = await ethers.getImpersonatedSigner(AAVE_HOLDER);
    this.uniHolder = await ethers.getImpersonatedSigner(UNI_HOLDER);
    this.wethHolder = await ethers.getImpersonatedSigner(WETH_HOLDER);

    // Send some ETH to tokens holders
    await deployer.sendTransaction({
      to: this.aaveHolder.address,
      value: ONE_ETH
    });
    await deployer.sendTransaction({
      to: this.uniHolder.address,
      value: ONE_ETH
    });
    await deployer.sendTransaction({
      to: this.wethHolder.address,
      value: ONE_ETH
    });

    this.initialAAVEBalance = await this.aave.balanceOf(this.aaveHolder.address)
    this.initialUNIBalance = await this.uni.balanceOf(this.uniHolder.address)
    this.initialWETHBalance = await this.weth.balanceOf(this.wethHolder.address)

    console.log("AAVE Holder AAVE Balance: ", ethers.utils.formatUnits(this.initialAAVEBalance))
    console.log("UNI Holder UNI Balance: ", ethers.utils.formatUnits(this.initialUNIBalance))
    console.log("WETH Holder WETH Balance: ", ethers.utils.formatUnits(this.initialWETHBalance))
  
  });

  it('Deploy depository and load receipt tokens', async function () {
    /** CODE YOUR SOLUTION HERE */

    // TODO: Deploy your depository contract with the supported assets
    const DepositoryFactory = await ethers.getContractFactory('contracts/erc20-2/TokensDepository.sol:TokensDepository', deployer);
    this.depository = await DepositoryFactory.deploy(AAVE_ADDRESS, UNI_ADDRESS, WETH_ADDRESS);
    
    // TODO: Load receipt tokens into objects under `this` (e.g this.rAve)
    this.rAave = await ethers.getContractAt(
      "rToken", await this.depository.baseToReceipt(AAVE_ADDRESS)
    )

    this.rUni = await ethers.getContractAt(
      "rToken", await this.depository.baseToReceipt(UNI_ADDRESS)
    )

    this.rWeth = await ethers.getContractAt(
      "rToken", await this.depository.baseToReceipt(WETH_ADDRESS)
    )
  });

  it('Deposit tokens tests', async function () {
    /** CODE YOUR SOLUTION HERE */

    // TODO: Deposit Tokens
    this.aaveAmount = ethers.utils.parseEther('15');
    this.uniAmount = ethers.utils.parseEther('5231');
    this.wethAmount = ethers.utils.parseEther('33');

    //approval for depository to make transferFrom
    await this.aave.connect(this.aaveHolder).approve(this.depository.address, this.aaveAmount);
    // 15 AAVE from AAVE Holder
    await this.depository.connect(this.aaveHolder).deposit(this.aaveAmount, AAVE_ADDRESS);
    
    await this.uni.connect(this.uniHolder).approve(this.depository.address, this.uniAmount);

    // 5231 UNI from UNI Holder
    this.depository.connect(this.uniHolder).deposit(this.uniAmount, UNI_ADDRESS);

    await this.weth.connect(this.wethHolder).approve(this.depository.address, this.wethAmount);

    // 33 WETH from WETH Holder
    this.depository.connect(this.wethHolder).deposit(this.wethAmount, WETH_ADDRESS);
    
    // TODO: Check that the tokens were sucessfuly transfered to the depository
    expect(await this.aave.balanceOf(this.depository.address)).to.be.equal(this.aaveAmount);
    expect(await this.uni.balanceOf(this.depository.address)).to.be.equal(this.uniAmount);
    expect(await this.weth.balanceOf(this.depository.address)).to.be.equal(this.wethAmount,);
    // TODO: Check that the right amount of receipt tokens were minted
    
    expect(await this.rAave.balanceOf(this.aaveHolder.address)).to.be.equal(this.aaveAmount);
    expect(await this.rUni.balanceOf(this.uniHolder.address)).to.be.equal(this.uniAmount);
    expect(await this.rWeth.balanceOf(this.wethHolder.address)).to.be.equal(this.wethAmount);
    
  });

  it('Withdraw tokens tests', async function () {
    /** CODE YOUR SOLUTION HERE */

    // TODO: Withdraw ALL the Tokens
    await this.depository.connect(this.aaveHolder).withdraw(this.aaveAmount, AAVE_ADDRESS);
    await this.depository.connect(this.uniHolder).withdraw(this.uniAmount, UNI_ADDRESS);
    await this.depository.connect(this.wethHolder).withdraw(this.wethAmount, WETH_ADDRESS);
    
    // TODO: Check that the right amount of tokens were withdrawn (depositors got back the assets)
    expect(await this.aave.balanceOf(this.aaveHolder.address)).to.be.equal(this.initialAAVEBalance);
    expect(await this.uni.balanceOf(this.uniHolder.address)).to.be.equal(this.initialUNIBalance);
    expect(await this.weth.balanceOf(this.wethHolder.address)).to.be.equal(this.initialWETHBalance);
    
    // TODO: Check that the right amount of receipt tokens were burned
    expect(await this.rAave.balanceOf(this.aaveHolder.address)).to.be.equal('0');
    expect(await this.rUni.balanceOf(this.uniHolder.address)).to.be.equal('0');
    expect(await this.rWeth.balanceOf(this.wethHolder.address)).to.be.equal('0');
    
  });


});
