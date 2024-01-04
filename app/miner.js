const Wallet = require('../wallet');
const Transaction = require('../wallet/transaction');

class Miner {
    constructor(blockchain, transactionPool, wallet, p2pServer ) {
      this.blockchain = blockchain;
      this.transactionPool = transactionPool;
      this.wallet = wallet;
      this.p2pServer = p2pServer;
    }
  
    mineTransactions() {
        // get the transaction pool's valid transactions
        const validTransactions = this.transactionPool.validTransactions();
    
        // generate the miner's reward
        validTransactions.push(
          Transaction.rewardTransaction(this.wallet, Wallet.blockChainWallet())
        );
    
        // add a block consisting of these transactions to the blockchain
        const block = this.blockchain.addBlock(validTransactions);

        this.p2pServer.sysncChain();
    
        // clear the pool
        this.transactionPool.clear();

        this.p2pServer.broadCastClearTransactions();

        return block;
      }
  }
  
  module.exports = Miner;