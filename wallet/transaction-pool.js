const Transaction = require('./transaction');

class TransactionPool {
   constructor() {
        this.transactions = [];
   }
   clear() {
    this.transactionMap = {};
    this.transactions = [];
   }

   clearBlockchainTransactions({ chain }) {
    for (let i=1; i<chain.length; i++) {
      const block = chain[i];

      for (let transaction of block.data) {
        if (this.transactionMap[transaction.id]) {
          delete this.transactionMap[transaction.id];
        }
      }
    }
  }

   updateOrAddTransaction(transaction) {
    console.log('transaction-pool.updateOrAddTransaction method');
        let transactionWithId = this.transactions.find(t => t.id === transaction.id);

        if (transactionWithId) {
          console.log('transaction-pool.updateOrAddTransaction  found transactionWithId');
            this.transactions[this.transactions.indexOf(transactionWithId)] = transaction;

        } else {
          console.log('transaction-pool.updateOrAddTransaction  in the else condition');
            this.transactions.push(transaction);
        }
   }

   existingTransaction(address) {
    return this.transactions.find(transaction => transaction.input.address === address);
  }


  validTransactions() {
    console.log('In the validTransaction method of transaction-pool');
    console.log(this.transactionMap);
    return this.transactions.filter(
      transaction => Transaction.validTransaction(transaction)
    );
  }
}

module.exports = TransactionPool;