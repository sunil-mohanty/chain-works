const Blockchain = require('./index');
const Block = require('./block');

describe ('Blockchain test',()=>{
    let blockchain, blockchain2 ;

    beforeEach(()=>{
          blockchain = new Blockchain();
          blockchain2 = new Blockchain();
    });

    it('Chck for the Gensis block',()=>{
        expect(blockchain.chain[0]).toEqual(Block.genesis());
    });

    it('Test adding a new block',()=>{
        const data = "new-block-data";
        blockchain.addBlock(data);
        expect(blockchain.chain[blockchain.chain.length-1].data).toEqual(data);

    });

    it('Test Block chain validity',()=>{
        blockchain2.addBlock('new-block-data-for-second-chain');
        expect(blockchain.isValidChain(blockchain2.chain)).toBe(true);

    });

    it('Test the Genesis block validity',()=>{
        blockchain2.chain[0].data = 'currupted Genesis';
        expect(blockchain.isValidChain(blockchain2.chain)).toBe(false);

    });


    it('Test the subsequent block validity',()=>{
            console.log("blockchain2[0].data = " + blockchain2.chain[0].data);
            // console.log("blockchain2[1].data = " + blockchain2.chain[1].data);
            blockchain2.addBlock('Test')
            blockchain2.chain[1].data = 'currupted Block-1 data';
            expect(blockchain.isValidChain(blockchain2.chain)).toBe(false);
 
     });

     it('Test block replacemnt for success case, where the incoming chain is longer than the current chain',()=>{
            blockchain2.addBlock('The Second Block');
            blockchain.replaceChain(blockchain2.chain);
            expect(blockchain.chain).toEqual(blockchain2.chain);
     });

     it('Test block replacement for failure case, where the incomming chain is not longer than the current chain',()=>{
            blockchain.addBlock('Test2');    
            blockchain.replaceChain(blockchain2.chain);
            expect(blockchain.chain).not.toEqual(blockchain2.chain);
     });
})