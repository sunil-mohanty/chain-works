const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./index');

describe('TransactionPool', () =>{

    let tp, wallet, transaction;
    
    beforeEach(()=>{
        tp = new TransactionPool();
        wallet = new Wallet();
        transaction = Transaction.newTransaction(wallet, 'RT-77RTS-91HK', 30);
        tp.updateOrAddTransaction(transaction);
    });

    it('add transaction to the pool', ()=>{
        expect(tp.transactions.find(t=> t.id===transaction.id)).toEqual(transaction);
    });

    it('update transaction in the pool',()=>{
        const oldTransaction = JSON.stringify(transaction);
        const newTransaction  = transaction.update(wallet, 'WBX-779882-91HK', 40);
        tp.updateOrAddTransaction(newTransaction);
        expect(JSON.stringify(tp.transactions.find(t=>t.id===newTransaction.id))).not.toEqual(JSON.stringify(oldTransaction));
    });
    
})