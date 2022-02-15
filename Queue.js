class Queue {
	constructor() {
		this.queue = [];
	}

	enqueue(fn) {
		this.queue.push(fn);
	}

	run() {
		setInterval(() => {
			if(this.queue.length > 0) {
				var a = this.queue.pop();
				a(() => {
					
				});
			}
		}, 50);
	}
}

module.exports = Queue || {};