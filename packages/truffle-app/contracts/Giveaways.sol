// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Giveaways is Ownable {
  struct Giveaway {
    bytes24 id;
    address[] participants;
    uint256 startTime;
    uint256 endTime;
    address[] winners;
    uint8 nWinners;
  }

  mapping(bytes24 => Giveaway) public giveaways;

  function createGiveaway(bytes24 id, uint256 startTime, uint256 endTime, uint8 nWinners) public onlyOwner {
    Giveaway memory giveaway;
    giveaway.id = id;
    giveaway.startTime = startTime;
    giveaway.endTime = endTime;
    giveaway.nWinners = nWinners;
    giveaways[id] = giveaway;
  }

  function addParticipant(bytes24 giveawayId, address participantAddress) public onlyOwner {
    Giveaway storage giveaway = giveaways[giveawayId];
        
    require(giveaway.id != bytes24(0), "Giveaway does not exist");
    require(block.timestamp >= giveaway.startTime && block.timestamp <= giveaway.endTime, "Giveaway is not active");
        
    // Check if the participant has already participated
    for (uint i = 0; i < giveaway.participants.length; i++) {
      if (giveaway.participants[i] == participantAddress) {
        revert("Participant has already participated");
      }
    }
        
    // Add the participant to the participants array
    giveaway.participants.push(participantAddress);
  }

  function generateWinners(bytes24 id) public onlyOwner {
    Giveaway storage giveaway = giveaways[id];

    require(giveaway.startTime <= block.timestamp, "Giveaway hasn't started yet");
    require(giveaway.endTime <= block.timestamp, "Giveaway hasn't ended yet");
    require(giveaway.participants.length >= giveaway.nWinners, "Not enough participants to choose a winner");
        
    address[] memory eligibleParticipants = new address[](giveaway.participants.length);
    uint16 numberOfEligibleParticipants = 0;

    // add participants to eligible participants list
    for (uint16 i = 0; i < giveaway.participants.length; i++) {
      eligibleParticipants[numberOfEligibleParticipants] = giveaway.participants[i];
      numberOfEligibleParticipants++;
    }

    // generate winners for eligible participants
    for (uint8 i = 0; i < giveaway.nWinners; i++) {
      uint16 randomIndex = uint16(uint256(keccak256(abi.encodePacked(blockhash(block.number - 1), block.timestamp, i))) % numberOfEligibleParticipants);
      giveaway.winners.push(eligibleParticipants[randomIndex]);
            
      // remove winner from eligible participants array
      numberOfEligibleParticipants--;
      eligibleParticipants[randomIndex] = eligibleParticipants[numberOfEligibleParticipants];
    }
  }

  function getParticipants(bytes24 id) public view returns (address[] memory) {
    require(giveaways[id].id != bytes24(0), "Giveaway does not exist");
    return giveaways[id].participants;
  }

  function getWinners(bytes24 id) public view returns (address[] memory) {
    require(giveaways[id].id != bytes24(0), "Giveaway does not exist");
    return giveaways[id].winners;
  }
}
