
//import SHA256 hash from crypto-js lib

const SHA256 = require("crypto-js/sha256");


// constructor for Block instance
class Block{
    constructor(index, timestamp, data, previousHash='') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    //generates hash used to uniquely identify block/index on chain
    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

// constructor for blockchain instance

class Blockchain{
    constructor() {
        this.chain = [this.createGenesisBlock()];

    }

    //Creates first block since there's no previous block as a reference

    createGenesisBlock() {
        return new Block(0, Date.now(), "Genesis block", "0");
    }

    // method to grab head of chain
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    // adds a new block to the chain by getting hash from previous block and calling calculateHash method for new block

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    // checks if chain has been tampered with

    isChainValid() {
        for(let i = 1;i < this.chain.length;i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                console.log(`Block @ index ${currentBlock.index} hash error`)
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                console.log(`Block @ index ${currentBlock.index} previousHash doesn't match previous block hash`)
                return false;
            } else {

                console.log(`You can trust this chain!`)
                return true;
            }

        }
    }

}

// Test chain 

let joeCoin = new Blockchain();
joeCoin.addBlock(new Block(1, Date.now(), {amount:100 }));
joeCoin.addBlock(new Block(2, Date.now(), {amount:200 }));

//alters block 1 to break relationship with previous block

// joeCoin.chain[1].data = { amount:800 }
// joeCoin.chain[1].hash = joeCoin.chain[1].calculateHash();

console.log(`Is joeCoin valid? ` + joeCoin.isChainValid());

// prints chain

console.log(JSON.stringify(joeCoin, null, 4));
