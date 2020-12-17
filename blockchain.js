const Block = require('./block')
const cryptoHash = require('./crypto-hash')

class Blockchain {
	constructor() {
		this.chain = [Block.genesis()];

	}

	addBlock({data}) {
		const newBlock = Block.mineBlock({
			lastBlock: this.chain[this.chain.length-1],
			data
		});
		this.chain.push(newBlock);
	}

	replaceChain(chain){
		if(chain.length <= this.chain.length){
			console.error('INcoming chain must be longer');
			return;
		}
		if (!Blockchain.isValidChain(chain)){
			console.error('incoming chain must be valid')
			return;
		}
		console.log('replacing chain with',chain);
		this.chain = chain;
	}
	static isValidChain(chain) {
		if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())){ 
			return false
		};

		for (let i = 1; i<chain.length; i++) {
			const {timestamp, lastHash, hash, nonce, difficulty,data} =chain[i];

			const actuallastHash = chain[i-1].hash; //gets the hash value of previous block
			const lastDifficulty = chain[i-1].difficulty;
			if(lastHash  !== actuallastHash) return false; //checks the hash value of previous block and compares with what hash value is written in the current block

			const validatedHash = cryptoHash(timestamp, lastHash, data, nonce, difficulty); //calculates the hash of current block 

			if (hash !== validatedHash) return false; //compares the calculated hash with the value already present.
			if(Math.abs(lastDifficulty - difficulty) > 1) return false;
		};

		return true;
	}
}

module.exports  = Blockchain;