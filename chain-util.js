const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const SHA256 = require('crypto-js/sha256');

const uuid = require('uuid');

class ChainUtil {

    static getKeyPair(){
        return ec.genKeyPair();
    }

    static getId(){
        return uuid.v1();
    }

    static getHash(data) {
        return SHA256(JSON.stringify(data)).toString();
    }

    static verifySignature(publicKey, signature, dataHash) {
        return ec.keyFromPublic(publicKey,'hex').verify(dataHash, signature);
    }
}

module.exports = ChainUtil;