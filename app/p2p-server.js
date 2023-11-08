const Websocket = require('ws');
const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

class P2pServer {
    constructor(blockchain){
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

    sendchain(socket){
        socket.send(JSON.stringify(this.blockchain.chain));
    }

    messageHandler(socket) {
        socket.on('message', message => {
            const data = JSON.parse(message);
            console.log("data :", data );
            this.blockchain.replaceChain(data);
        });
    }

    sysncChain(){
        this.sockets.forEach(socket=>{
            this.sendchain(socket);
        });
    }



}
module.exports = P2pServer;