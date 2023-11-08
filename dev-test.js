const Blockchain = require('./blockchain');
const Wallet = require('./wallet');
const wallet = new Wallet();


const bc = new Blockchain();

for (let i=0; i<10; i++) {
    console.log('--------------------------------------------');
    console.log(bc.addBlock(`foo {i}`).toString());
}

console.log('wallet ===========================================:', wallet.toString());