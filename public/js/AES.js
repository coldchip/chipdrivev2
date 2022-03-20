import aesjs from 'aes-js';
import sha256 from 'js-sha256';

class AES {
	constructor(key, id, offset) {
		var _key = sha256.create()
			.update(key)
			.update("chipdrive")
			.array()
			.slice(0, 32);
		var iv = sha256.create()
			.update(id)
			.update("chipdrive")
			.array()
			.slice(0, 16);

		AES.counterOffset(iv, offset / 16);

		this.aesjs = new aesjs.ModeOfOperation.ctr(_key, iv);
	}

	static closestBlock(value, roundTo = 16) {
		if(value % roundTo == 0) {
			return value;
		}
		return Math.floor(value / roundTo) * roundTo;
	}

	static counterOffset(iv, inc) {
		for(var i = iv.length - 1; i >= 0; i--) {
			inc += iv[i]; // add the previous value to the incrementer
			iv[i] = inc % 256; // get the first 8 bits
			inc = Math.floor(inc / 256); // carry the remainder to the next array
		}
	}

	encrypt(buffer) {
		return this.aesjs.encrypt(buffer)
	}

	decrypt(buffer) {
		return this.aesjs.decrypt(buffer)
	}
}

export default AES || {};