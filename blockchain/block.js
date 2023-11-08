
const {DIFFICULTY} = require('../config');
const {MIN_RATE} = require('../config');
const ChainUtil = require('../chain-util');

class Block {

    constructor(timestamp, lastHash, hash, data, noance, difficulty) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash ;
        this.data = data;
        this.noance = noance;
        this.difficulty = difficulty || DIFFICULTY;

    }

    toString(){
        return `
           Block -
           timestamp    : ${this.timestamp}
           lastHash     : ${this.lastHash.substring(0, 10)}
           hash         : ${this.hash.substring(0, 10)}
           data         : ${this.data}
           noance       : ${this.noance} 
           dificulty    : ${this.difficulty}
        `;
          
    }

   static genesis () {
        return new this('Universe start time', '------', '0X99RTX', "", 0, DIFFICULTY);
   }

   static mineBlock(lastBlock, data) {
        const lastHash = lastBlock.hash;
        let hash, timestamp;
        let noance = 0;   
        let {difficulty} = lastBlock;

        do {
            noance ++;
            timestamp = Date();
            difficulty = this.calculateDifficulty(lastBlock, timestamp);
            hash = Block.hash(timestamp, lastHash, data, noance, difficulty);
        
        } while(hash.substring(0,difficulty) !== '0'.repeat(difficulty))
        
         
        return new this(timestamp, lastHash, hash, data, noance, difficulty);

   }

   static calculateDifficulty(lastBlock, timestamp){

         let {difficulty} = lastBlock;
         difficulty = lastBlock.timestamp + MIN_RATE > timestamp ? difficulty + 1 : difficulty - 1;
         return difficulty;

   }

   static hash(timestamp, lastHash, data, noance, difficulty) {

        return ChainUtil.getHash(`${timestamp}${lastHash}${data}${noance}${difficulty}`);

   }

   static blockHash(block) {
       const {timestamp, lastHash, data, noance, difficulty} = block;
       return this.hash(timestamp, lastHash, data, noance, difficulty) ;
   }

}

module.exports = Block;