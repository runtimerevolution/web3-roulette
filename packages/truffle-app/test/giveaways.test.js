const Giveaways = artifacts.require("Giveaways");
const Web3 = require('web3');
const { expect } = require('chai');
const { advanceTimeAndBlock } = require('./utils')

contract("Giveaways", (accounts) => {
  let giveawaysInstance;
  let web3;

  beforeEach(async () => {
    giveawaysInstance = await Giveaways.new();
    web3 = new Web3()
  });

  it("should have an owner", async () => {
    const owner = await giveawaysInstance.owner();
    assert(owner !== 0, "The contract should have an owner");
  });

  it("should create a new giveaway", async () => {
    const id = web3.utils.asciiToHex("507f191e810c19729de860ea");
    const whitelist = [accounts[1], accounts[2]];
    const startTime = Math.floor(Date.now() / 1000) - 10;
    const endTime = Math.floor(Date.now() / 1000) + 10;
    const nWinners = 1;

    await giveawaysInstance.createGiveaway(id, whitelist, startTime, endTime, nWinners);
    const giveaway = await giveawaysInstance.giveaways(id);
    const giveawayWhitelist = await giveawaysInstance.getWhitelist(id)

    assert.equal(giveaway.id, id);
    assert.equal(giveaway.startTime, startTime);
    assert.equal(giveaway.endTime, endTime);
    assert.equal(giveaway.nWinners, nWinners);
    expect(giveawayWhitelist).to.deep.equal(whitelist);
  });

  it("should add a participant to a giveaway", async () => {
    const id = web3.utils.asciiToHex("507f191e810c19729de860ea");
    const whitelist = [accounts[1], accounts[2]];
    const startTime = Math.floor(Date.now() / 1000) - 3600;
    const endTime = Math.floor(Date.now() / 1000) + 3600;
    const nWinners = 1;

    await giveawaysInstance.createGiveaway(id, whitelist, startTime, endTime, nWinners);
    await giveawaysInstance.addParticipant(id, accounts[1]);
    const participants = await giveawaysInstance.getParticipants(id);

    assert.equal(participants[0], accounts[1]);
  });

  it("should not allow adding a participant to a nonexistent giveaway", async function () {
    const id = web3.utils.asciiToHex("507f191e810c19729de860ea");
    const participantAddress = accounts[0];

    try {
      await giveawaysInstance.addParticipant(id, participantAddress);
      expect.fail("Expected revert, but transaction succeeded");
    } catch (error) {
      expect(error.message).to.include("Giveaway does not exist");
    }
  });

  it("should not allow a participant who is not whitelisted to participate in the giveaway", async () => {
    const id = web3.utils.asciiToHex("507f191e810c19729de860ea");
    const whitelist = [accounts[1], accounts[2]];
    const startTime = Math.floor(Date.now() / 1000) - 3600;
    const endTime = Math.floor(Date.now() / 1000) + 3600;
    const nWinners = 1;
    
    await giveawaysInstance.createGiveaway(id, whitelist, startTime, endTime, nWinners);

    try {
        await giveawaysInstance.addParticipant(id, accounts[0]);
        expect.fail("Expected revert, but transaction succeeded");
      } catch (error) {
        expect(error.message).to.include("Participant is not whitelisted");
    }
  });

  it("should not add a participant that has already entered the giveaway", async () => {
    const id = web3.utils.asciiToHex("507f191e810c19729de860ea");
    const whitelist = [accounts[1], accounts[2]];
    const startTime = Math.floor(Date.now() / 1000) - 3600;
    const endTime = Math.floor(Date.now() / 1000) + 3600;
    const nWinners = 1;
    
    await giveawaysInstance.createGiveaway(id, whitelist, startTime, endTime, nWinners);
    await giveawaysInstance.addParticipant(id, accounts[1]);

    try {
        await giveawaysInstance.addParticipant(id, accounts[1]);
        expect.fail("Expected revert, but transaction succeeded");
      } catch (error) {
        expect(error.message).to.include("Participant has already participated");
    }
  })

  it("should not generate winner if giveaway has not ended", async () => {
    const id = web3.utils.asciiToHex("507f191e810c19729de860ea");
    const whitelist = [accounts[1], accounts[2], accounts[3], accounts[4], accounts[5]];
    const startTime = Math.floor((Date.now() / 1000) - 3600);
    const endTime = Math.floor((Date.now() / 1000) + 3600);
    const nWinners = 2;

    await giveawaysInstance.createGiveaway(id, whitelist, startTime, endTime, nWinners)
    for (let i = 0; i < whitelist.length; i++) {
        await giveawaysInstance.addParticipant(id, whitelist[i]);
    }

    try {
        await giveawaysInstance.generateWinners(id);
        expect.fail("Expected revert, but transaction succeeded");
      } catch (error) {
        expect(error.message).to.include("Giveaway hasn't ended yet");
    }
  });

  it("should generate a winner after the giveaway has ended", async function () {
    const id = web3.utils.asciiToHex("507f191e810c19729de860ea");
    const whitelist = [accounts[1], accounts[2], accounts[3], accounts[4], accounts[5]];
    const startTime = Math.floor((Date.now() / 1000) - 3600);
    const endTime = Math.floor((Date.now() / 1000) + 3600);
    const nWinners = 2;

    await giveawaysInstance.createGiveaway(id, whitelist, startTime, endTime, nWinners)
    for (let i = 0; i < whitelist.length; i++) {
        await giveawaysInstance.addParticipant(id, whitelist[i]);
    }
    await advanceTimeAndBlock(3610);
    await giveawaysInstance.generateWinners(id);
    const winners = await giveawaysInstance.getWinners(id);

    expect(winners.length).to.equal(2);
    expect(whitelist).to.include(winners[0]);
    expect(whitelist).to.include(winners[1]);
  });
});
