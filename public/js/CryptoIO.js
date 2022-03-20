import IO from './IO.js';
import AES from './AES.js';

class CryptoIO {
	static CHUNK_SIZE = 1048576;

	constructor(key) {
		if(!key) throw new Error("Undefined key passed in");
		this.key = key;
	}

	static readFile(file) {
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
		var aes = new AES(this.key, id, 0);

		for(var start = 0; start < file.size; start += CryptoIO.CHUNK_SIZE) {
			var end = Math.min(start + CryptoIO.CHUNK_SIZE, file.size);

			var chunk = file.slice(start, end);

			var buffer = new Uint8Array(await CryptoIO.readFile(chunk));

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

		var startBlock = AES.closestBlock(start);

		return fetch(`/api/v2/drive/object/${id}`, {
			headers: {
				start: startBlock,
				end: end
			}
		}).then(async (response) => {
			var data = new Uint8Array(await response.arrayBuffer());

			var aes = new AES(this.key, id, startBlock)
			var decrypted = aes.decrypt(data);

			var total = response.headers.get("total");
			var size = response.headers.get("content-length");

			return {
				total: total,
				size: size,
				start: start,
				end: Math.min((start + size) - 1, total - 1),
				buffer: decrypted.slice(start - startBlock)
			}
		});
	}
}

export default CryptoIO || {};