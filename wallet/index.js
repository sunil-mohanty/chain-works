const { INITIAL_BALANCE } = require('../config');
const ChainUtil = require('../chain-util');
const Transaction = require('./transaction');

class Wallet {
  constructor() {
    this.balance = INITIAL_BALANCE;
    this.keyPair = ChainUtil.getKeyPair();
    this.publicKey = this.keyPair.getPublic().encode('hex');
  }


  toString() {
    return `Wallet-
            publicKey   : ${this.publicKey}
            balance     : ${this.balance}
        `
  }

  sign(dataHash) {
    return this.keyPair.sign(dataHash);
  }


  createTransaction(recipient, amount, blockchain, transactionPool) {

    this.balance = this.calculateBalance(blockchain.chain, this.publicKey)

    console.log(`current balance: ${this.balance}`);

    if (amount > this.balance) {
      console.log(`Amount: ${amount}, exceeds current balance: ${this.balance}`);
      return;
    }
    console.log('wallet [index.js] createTransaction method');

    let transaction = transactionPool.existingTransaction(this.publicKey);

    if (transaction) {
      console.log('wallet [index.js] createTransaction method if condition');
      transaction.update(this, recipient, amount);

    } else {
      console.log('wallet [index.js] createTransaction method else condition');
      console.log(Transaction);
      //transaction = Transaction.newTransaction(new Wallet(), 'ertuiuy', amount);
      transaction = Transaction.newTransaction(this, recipient, amount);
      //transaction = Transaction.newTransaction({senderWallet:this, recipient:recipient, amount:amount});
      transactionPool.updateOrAddTransaction(transaction);
    }


    return transaction;
  }

  static blockChainWallet() {
    const blockChainWallet = new this();
    blockChainWallet.address = 'blockchain-wallet';
    return blockChainWallet;
  }

  calculateBalance(chain, address) {
    console.log('In the calculateBalance method');
    let hasConductedTransaction = false;
    let outputsTotal = 0;

    console.log('hello');
    console.log(chain);
    console.log('hi');

    for (let i = chain.length - 1; i > 0; i--) {
      const block = chain[i];
      
      /*
      console.log(`block hash= ${block.hash}`);
      console.log(`block number = ${i}`);
      console.log(`block.data = ${block.data}`);
      */
      if(block.hash === undefined || block.hash  === null) {
          continue;
      }

      for (let transaction of block.data) {
      
        console.log(transaction);

        if (!Object.keys(transaction).includes("input")) {
           console.log('doesn not have input field');
           continue;   
        }

        const hasAddressField = Object.keys(transaction.input).includes("address");
        console.log(`block  hasAddressField= ${hasAddressField}`);

        if(!hasAddressField) {
          console.log(`address field doesn\'t present in this block`);
          continue;
        }

        if (transaction.input.address === address) {
          console.log(`block  hasConductedTransaction= ${hasConductedTransaction}`);
          hasConductedTransaction = true;
        }


        const totalAmountForAddress = transaction.outputs.reduce((total, output) => {
          // Check if the address is "hello-4dr3ss-3001" before adding the amount
          if (output.address === address) {
            return total + output.amount;
          }
          return total;
        }, 0);

        console.log(`totalAmountForAddress = ${totalAmountForAddress}`);

        outputsTotal = outputsTotal + totalAmountForAddress;

        console.log(`outputsTotal = ${outputsTotal}`);

      }

      if (hasConductedTransaction) {
        console.log('hasConductedTransaction  in the break condition');
        break;
      }
    }

    return hasConductedTransaction ? outputsTotal : INITIAL_BALANCE + outputsTotal;
  }
}

module.exports = Wallet;

