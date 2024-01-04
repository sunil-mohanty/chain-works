const express = require('express');
const Blockchain = require('../blockchain');
const Wallet = require('../wallet');
const TransactionPool = require('../wallet/transaction-pool');
const Miner = require('./miner');

const P2pServer = require('./p2p-server'); 

const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = express();
const blockchain = new Blockchain();
const tp = new TransactionPool();
const p2pServer = new P2pServer(blockchain, tp);
const wallet = new Wallet();
const miner = new Miner(blockchain, tp, wallet, p2pServer);

/*
app.get('/blocks',(req, res)=>{
    res.json(blockchain.chain);
});

app.use(bodyParser.json());

app.post('/mine',(req, res)=>{
    const block = blockchain.addBlock(req.body.data);
    console.log(`New block added: ${block.toString()}`);
    p2pServer.sysncChain();
    
    res.redirect('/blocks');

})
*/

const loginController = require('./login-controller');
const walletController = require('./wallet-controller')(wallet,blockchain);
const blockController = require('./block-controller')(blockchain,p2pServer);

app.use(express.json())

// Use the controllers
app.use('/api/login', loginController);
app.use('/api/wallet', walletController);
app.use('/api/blocks', blockController);


app.get('/api/transaction/list', (req, res) => {
    res.json(tp.transactions);
  });
 
app.post('/api/transaction/initiate', (req, res) => {
    const { recipient, amount } = req.body;
            
    const transaction = wallet.createTransaction(recipient, amount, blockchain,tp);
    p2pServer.broadcastTransaction(transaction);
    res.redirect('/api/transaction/list');
}); 


app.get('/api/mine-transctions',(req, res) =>{
    const block = miner.mineTransactions();

    console.log('New block added : ${block.toString()}');

    res.redirect('/api/blocks/list');
})

app.listen(HTTP_PORT,()=>console.log(`Listening at port ${HTTP_PORT}`));
p2pServer.listen();

module.exports = {blockchain, p2pServer};