const express = require('express');
const Blockchain = require('../blockchain');

const P2pServer = require('./p2p-server'); 

const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = express();
const blockchain = new Blockchain();
const p2pServer = new P2pServer(blockchain);

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
const walletController = require('./wallet-controller');
const blockController = require('./block-controller')(blockchain,p2pServer);

// Use the controllers
app.use('/api/login', loginController);
app.use('/api/wallets', walletController);
app.use('/api/blocks', blockController);

app.listen(HTTP_PORT,()=>console.log(`Listening at port ${HTTP_PORT}`));
p2pServer.listen();

module.exports = {blockchain, p2pServer};