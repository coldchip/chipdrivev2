import aesjs from 'aes-js';
import sha256 from 'js-sha256';

import IO from './IO.js';

class CryptoIO {
	static CHUNK_SIZE = 1048576;

	constructor(token) {
		if(!token) throw new Error("Undefined token passed in");
		this.token = token;
	}

	static counterOffset(iv, inc) {
		for(var i = iv.length - 1; i >= 0; i--) {
			inc += iv[i]; // add the previous value to the incrementer
			iv[i] = inc % 256; // get the first 8 bits
			inc = Math.floor(inc / 256); // carry the remainder to the next array
		}
	}

	static nearestBlock(value, roundTo) {
		if(value % roundTo == 0) {
			return value;
		}
		return Math.floor(value / roundTo) * roundTo;
	}

	static readFileAsync = (file) => {
		return new Promise((resolve, reject) => {
			let reader = new FileReader();

			reader.onload = () => {
				resolve(reader.result);
			};

			reader.onerror = reject;

			reader.readAsArrayBuffer(file);
		});
	}

	async putFile(id, file) {
		var key  = sha256.create()
			.update(this.token)
			.update("chipdrive")
			.array()
			.slice(0, 32);
		var iv = sha256.create()
			.update(id)
			.update("chipdrive")
			.array()
			.slice(0, 16);

		var aes = new aesjs.ModeOfOperation.ctr(key, iv);

		for(var start = 0; start < file.size; start += CryptoIO.CHUNK_SIZE) {
			var end = Math.min(start + CryptoIO.CHUNK_SIZE, file.size);

			var chunk = file.slice(start, end);

			var buffer = new Uint8Array(await CryptoIO.readFileAsync(chunk));

			var encrypted = aes.encrypt(buffer);

			await IO.put(`/api/v2/drive/object/${id}/${start}`, encrypted, (e) => {
				var progress = e.toFixed(2);
				console.log(`Uploading ${progress}%`);
			});
		}
	}

	getChunk(id, start, end) {
		// clamp it to the chunk size 
		if((end - start) + 1 > CryptoIO.CHUNK_SIZE) {
			end = (start + CryptoIO.CHUNK_SIZE) - 1;
		}

		var startBlock = CryptoIO.nearestBlock(start, 16);

		return fetch(`/api/v2/drive/object/${id}`, {
			headers: {
				start: startBlock,
				end: end
			}
		}).then(async (response) => {
			var data = new Uint8Array(await response.arrayBuffer());

			var key = sha256.create()
				.update(this.token)
				.update("chipdrive")
				.array()
				.slice(0, 32);
			var iv = sha256.create()
				.update(id)
				.update("chipdrive")
				.array()
				.slice(0, 16);

			CryptoIO.counterOffset(iv, startBlock / 16);

			var aes = new aesjs.ModeOfOperation.ctr(key, iv);

			var decrypted = aes.decrypt(data);

			var total = response.headers.get("total");
			var size = response.headers.get("content-length");

			return {
				total: total,
				size: size,
				start: start,
				end: Math.min((start + size) - 1, total - 1),
				buffer: decrypted.slice(start - startBlock) // removes unused bytes that are used for decryption
			}
		});
	}
}

export default CryptoIO || {};