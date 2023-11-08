const express = require('express');
const bodyParser = require('body-parser');
/*

router.get('/list',(req, res)=>{
    console.log(blockchain);
    console.log(p2pServer);
    res.json(blockchain.chain);
});

router.use(bodyParser.json());

router.post('/mine',(req, res)=>{
    const block = blockchain.addBlock(req.body.data);
    console.log(`New block added: ${block.toString()}`);
    p2pServer.sysncChain();
    
    res.redirect('/blocks/list');
});

module.exports = router;

*/


module.exports = function (blockchain, p2pServer) {
    const express = require('express');
    const router = express.Router();
  
    router.get('/list',(req, res)=>{
        console.log(blockchain);
        console.log(p2pServer);
        res.json(blockchain.chain);
    });
    
    router.use(bodyParser.json());
    
    router.post('/mine',(req, res)=>{
        const block = blockchain.addBlock(req.body.data);
        console.log(`New block added: ${block.toString()}`);
        p2pServer.sysncChain();
        
        res.redirect('/api/blocks/list');
    });
  
    return router;
  };
  