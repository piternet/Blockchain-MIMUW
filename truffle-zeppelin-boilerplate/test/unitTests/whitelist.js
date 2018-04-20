import {createWeb3, deployContract, expectThrow} from 'ethworks-solidity';
import whitelistJson from '../../build/contracts/Whitelist.json';
import Web3 from 'web3';
import chai from 'chai';
const {expect} = chai;

describe('Whitelist', async () => {
  const web3 = createWeb3(Web3);
  let accounts;
  let whitelistContract;
  let whitelistOwner;

  before(async () => {
    accounts = await web3.eth.getAccounts();
    [whitelistOwner] = accounts;
  });

  beforeEach(async () => {
    whitelistContract = await deployContract(web3, whitelistJson, whitelistOwner);
  });

  it('should be deployed successfully', async () => {
    const {address} = whitelistContract.options;
    expect(address).to.not.be.null;
  });

  it("should add someone to whitelist successfully", async function () {
    await whitelistContract.methods.add(whitelistOwner).send({from: whitelistOwner});
    expect(await whitelistContract.methods.isWhitelisted(whitelistOwner).call()).to.be.true;
  });

  it("should remove someone from whitelist successfully", async function () {
    await whitelistContract.methods.remove(whitelistOwner).send({from: whitelistOwner});
    expect(await whitelistContract.methods.isWhitelisted(whitelistOwner).call()).to.be.false;
  });

  it("only a owner could change the whitelist", async function () {
    await expectThrow(whitelistContract.methods.add(accounts[3]).send({from: accounts[3]}));
  });

  it("everyone should could view the whitelist", async function () {
    await whitelistContract.methods.add(accounts[5]).send({from: whitelistOwner});
    expect(await whitelistContract.methods.isWhitelisted(accounts[5]).call({from: accounts[5]})).to.be.true;
  });

});
