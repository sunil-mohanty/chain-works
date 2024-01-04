const Transaction = require('./transaction');
const Wallet = require('./index');
const { REWARD_INPUT, MINING_REWARD } = require('../config');
describe('Transaction with amount which is lesser than the available balance',()=>{
    let transaction, wallet, recipient, amount;

    beforeEach(()=>{
        wallet = new Wallet();
        amount = 50;
        recipient = 'FX39JZ70';
        console.log('In the transaction.test method');
        console.log(Transaction);
        transaction = Transaction.newTransaction (wallet, recipient, amount); 
    });

    it('Check the amount got debited from the senders account', ()=>{
         expect(transaction.outputs.find(output=>output.address === wallet.publicKey).amount)
           .toEqual(wallet.balance-amount);
    });

    
    it('Check the amount received by the receiver', ()=>{
        expect(transaction.outputs.find(output=>output.address === recipient).amount)
          .toEqual(amount);
   });

   it('Verify the input amount to the transaction is equal to the wallet balance',()=>{
        expect(transaction.input.amount).toEqual(wallet.balance);
   });

   it('Verify the transaction signature for a valid transaction',()=>{
        expect(Transaction.verifySignature(transaction)).toBe(true);
   });

   it('Verify the transaction signature for a corrupt transaction', ()=>{
        transaction.outputs[0] = 901;    
        expect(Transaction.verifySignature(transaction)).toBe(false);
   });

   describe('Transaction with amount higher than the available balance', () =>{
         let amount, wallet, transaction, recipient;

         beforeEach(()=>{
            amount = 600;
            wallet = new Wallet();
            recipient = "XZWE9870TY"
            transaction = Transaction.newTransaction(wallet, recipient, amount);
         });
         
         it('Since the balance is less than the available balance the transaction should not go through', ()=>{
            expect(transaction).toEqual(undefined)
         });
   });

   describe('Update transaction test', ()=>{
        let nextWallet, nextAmount;
    
        beforeEach(()=>{
            nextAmount = 20;
            nextWallet = "VWNSTX78109";
            transaction = transaction.update(wallet, nextWallet, nextAmount);
        });

        it(`check the sender's balance`, ()=> {
            expect(transaction.outputs.find(output=>output.address === wallet.publicKey).amount).toEqual(wallet.balance-amount-nextAmount);
        });

        it(`check the balace of the next recipient`, () => {
            console.log(`JSON.stringify(transaction.outputs) : ` , JSON.stringify(transaction.outputs));
            expect(transaction.outputs.find(output=>output.address === nextWallet).amount).toEqual(nextAmount);
        });

   });

   describe('rewardTransaction()', () => {
    let rewardTransaction, minerWallet;

    beforeEach(() => {
      minerWallet = new Wallet();
      rewardTransaction = Transaction.rewardTransaction(minerWallet);
    });

    it('creates a transaction with the reward input', () => {
      expect(rewardTransaction.input).toEqual(REWARD_INPUT);
    });

    it('creates one transaction for the miner with the `MINING_REWARD`', () => {
      expect(rewardTransaction.outputMap[minerWallet.publicKey]).toEqual(MINING_REWARD);
    });
  });

    
})

