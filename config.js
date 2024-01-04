const DIFFICULTY = 2;
const MINE_RATE = 3000;
const INITIAL_BALANCE = 500;
const REWARD_INPUT = { address: '*authorized-reward*' };
const INITIAL_DIFFICULTY = 3;
const MINING_REWARD = 50;

const GENESIS_DATA = {
    timestamp: 1,
    lastHash: '-----',
    hash: 'hash-one',
    difficulty: INITIAL_DIFFICULTY,
    nonce: 0,
    data: []
  };

module.exports = {GENESIS_DATA,MINE_RATE,INITIAL_BALANCE,REWARD_INPUT,MINING_REWARD,DIFFICULTY};
