const Block = require('./block');

class Blockchain {

    constructor() {
        this.chain = [Block.genesis()];
    }

    addBlock(data) {
        const newBlock = Block.mineBlock(this.chain[this.chain.length-1], data);
        this.chain.push(newBlock);
        return newBlock;
    }

    isValidChain(chain) {

        if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
            console.log('Genesis validation failed');
            return false;
        }

        for (let i=1; i < chain.length; i++) {
            const block = chain[i];
            const lastBlock = chain[i-1];
           
            if(block.lastHash !== lastBlock.hash) {
                console.log('lastHash validation failed');
                return false;
            }

            if (Block.blockHash(block) !== block.hash) {
                console.log('BlockHash validation failed');
                return false;

            }
        }

        return true;
    }

    replaceChain(chain){

        if(chain.length <= this.chain.length) {
            console.log("The input chain is not long enough");
            return;
        }

        if(!this.isValidChain(chain)) {
            console.log("The input chain is not vald one");
            return;
        }

        this.chain = chain;

        console.log('The current chain got replaced with the new Chain');

    }

}

module.exports = Blockchain;