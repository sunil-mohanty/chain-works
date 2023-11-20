const Wallet = require('../wallet');
const express = require('express');
const router = express.Router();

router.use(express.json());


const wallet = [{
    walletId: 'X9081765321879ZDSFT101KHJ57DQR323',
    balance : 373.05

},
{
    walletId: 'Z7531781765321879ZDSFT101KHJ57DQR',
    balance : 771.07

}];

router.post('/', (req, res)=>{
    const userName = req.body.userName;
    console.log('request came from user :' , req.body);
    console.log('request came from user :' , userName);
    return res.json(wallet);
});

module.exports = router;