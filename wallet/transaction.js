const { sign } = require('.');
const ChainUtil = require('../chain-util');
const {MINING_REWARD} = require('../config');
const {REWARD_INPUT} = require('../config');

class Transaction {
    constructor(){
         this.id = ChainUtil.getId();
         this.input = null;
         this.outputs = [] ;
    }

    static newTransaction(senderWallet, recipient, amount) {
        console.log('transaction.js newTransaction method');
        
        if( amount > senderWallet.balance) {
            console.log('Amount ${amount} exceeds the balance');
            return;
        }

       
        return Transaction.transactionWithOutputs(senderWallet, [
            {amount : senderWallet.balance - amount, address : senderWallet.publicKey},
            {amount, address: recipient}
         ]);

    }

    static transactionWithOutputs(senderWallet, outputs) {
        const transaction = new this();
        transaction.outputs.push(...outputs);
        Transaction.signTransaction(transaction, senderWallet);
        return transaction;

    }

    static rewardTransaction(minerWallet, blockchainWallet) {
        return Transaction.transactionWithOutputs(blockchainWallet, [{amount: MINING_REWARD, address: minerWallet.publicKey}]);

    }

    static signTransaction(transaction, senderWallet) {
        transaction.input = {
            timestamp : Date.now(),
            amount : senderWallet.balance,
            address : senderWallet.publicKey,
            signature : senderWallet.sign(ChainUtil.getHash(transaction.outputs))

        };
    }

    static verifySignature(transaction) {
        return ChainUtil.verifySignature(
            transaction.input.address,
            transaction.input.signature,
            ChainUtil.getHash(transaction.outputs)
        );
    }

    update(senderWallet, recipient, amount ) {
        //console.log(`this====>`, JSON.stringify(this));
        const senderWalletOutput = this.outputs.find(output=> output.address === senderWallet.publicKey);
        
        if (amount > senderWalletOutput.balance) {
            console.log('sender does not have enough balance to proceed with this amount ${amount}');
            return;
        }

        senderWalletOutput.amount = senderWalletOutput.amount - amount;
        this.outputs.push(
            {amount, address: recipient}
        ); 
        Transaction.signTransaction(this, senderWallet);
        return this;
    }

    static validTransaction(transaction) {
        console.log('validTransaction method is getting called from transaction.js')
        const { input: { address, amount, signature }, outputs } = transaction;
    
        // const outputTotal =outputs
        //   .reduce((total, amount) => total + amount);
        
        const outputTotal = outputs.reduce((total, output) => total + output.amount, 0); 
    
        console.log('validTransaction method is getting called from transaction.js amount value :'+amount);
        console.log('validTransaction method is getting called from transaction.js outputTotal value :'+outputTotal);  
        if (amount !== outputTotal) {
          console.error(`Invalid transaction from ${address}`);
    
          return false;
        }
    
        if (!Transaction.verifySignature(transaction)) {
          console.error(`Invalid signature from ${address}`);
          return false;
        }
    
        return true;
      }
    
   
    
}

module.exports = Transaction;