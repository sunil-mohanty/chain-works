const express = require('express');
const router = express.Router();

const wallet = {
    address: 'X9081765321879ZDSFT101KHJ57DQR323',
};

router.post('/', (req, res)=>{
    return res.json(wallet);
});

module.exports = router;