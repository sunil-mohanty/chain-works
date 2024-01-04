const Websocket = require('ws');
const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

const MESSAGE_TYPES = {
    chain: 'CHAIN',
    transaction: 'TRANSACTION',
    clear_transaction: 'CLEAR_TRANSACTION'

   };

class P2pServer {
    constructor(blockchain, transactionPool){
        this.transactionPool = transactionPool;
        this.blockchain = blockchain;
        this.sockets = [];
    }

    listen(){
        const server = new Websocket.Server({port: P2P_PORT});
        server.on('connection', socket=> this.connectSocket(socket));
        this.connectToPeer();
    }

    connectToPeer() {
        peers.forEach(peer=>{
            console.log("peer = " + peer);
            const socket = new Websocket(peer);
            this.sockets.push(socket);
            socket.on('open',() => this.connectSocket(socket));
        })
    }

    connectSocket(socket){
        this.sockets.push(socket);
        console.log('Socket connected');
        this.messageHandler(socket);
        socket.send(JSON.stringify(this.blockchain.chain));
    }

    sendChain(socket) {
        socket.send(JSON.stringify({ type: MESSAGE_TYPES.chain, chain: this.blockchain.chain }));
      }
     
    sendTransaction(socket, transaction) {
        socket.send(JSON.stringify({ type: MESSAGE_TYPES.transaction, transaction }));
    }
        
    broadcastTransaction(transaction) {
        this.sockets.forEach(socket => this.sendTransaction(socket, transaction));
    }

    broadCastClearTransactions(){

        this.sockets.forEach(socket=>socket.send(JSON.stringify({type:MESSAGE_TYPES.clear_transaction})));
       
    }

    
    messageHandler(socket) {
        socket.on('message', message => {
          
          const data = JSON.parse(message);
          console.log(`in the messageHandler : ${data.type}`);
          switch(data.type) {
            case MESSAGE_TYPES.chain:
                this.blockchain.replaceChain(data.chain);
                break;
            case MESSAGE_TYPES.transaction:
                this.transactionPool.updateOrAddTransaction(data.transaction);
                break;
            case MESSAGE_TYPES.clear_transaction:
                this.transactionPool.clear();
                break;  
          }
      });
    }

    sysncChain(){
        this.sockets.forEach(socket=>{
            this.sendChain(socket);
        });
    }



}
module.exports = P2pServer;