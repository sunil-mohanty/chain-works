const Block = require('./block');
const {DIFFICULTY} = require('../config');

describe('Block' ,() => {
  
    let data, lastBlock, block;
    
    beforeEach(()=>{
        data = 'bar';
        lastBlock = Block.genesis();
        block = Block.mineBlock(lastBlock, data);
    })

    it('Match the blockdata', () =>{
       expect(block.data).toEqual(data);
    });

    it('Match the lastHash', () =>{
       expect(lastBlock.hash).toEqual(block.lastHash);
    });

    it('Generate a hash that matches the difficulty', () => {
        console.log('block', block);
        expect(block.hash.substring(0,DIFFICULTY)).toEqual('0'.repeat(DIFFICULTY));
    });

    it ('lower the difficulty if the minging is slow', () =>{

        expect(Block.calculateDifficulty(block, block.timestamp + 36000)).toEqual(block.difficulty - 1);

    });


    it ('increase the difficulty if the minging spead is high', () =>{

        expect(Block.calculateDifficulty(block, block.timestamp + 1)).toEqual(block.difficulty + 1);

    });

    it ('Generated hash matches the difficulty',()=>{
        expect(block.hash.substring(0,block.difficulty)).toEqual('0'.repeat(block.difficulty));
    });
})