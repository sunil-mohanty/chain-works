class Wallet {

    constructor(walletId, balance) {
        this.walletId = walletId;
        this.balance = balance;
        
    }

    toString(){
        return `
           Block -
           walletId    : ${this.walletId}
           balance     : ${this.balance}
        `;
          
    }

}

module.exports = Wallet;