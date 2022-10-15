var Queue = {
    tasks: [],
    length: function(name) {
    	if(name) {
    		return Queue.tasks.filter(task => task.name === name).length;
    	} else {
    		return Queue.tasks.length;
    	}
    },
    enqueue: function(name, q) {
    	console.log(Queue.length());
    	if(Queue.length() < 30) {
        	Queue.tasks.push({
        		name: name,
        		callback: q
        	});
        	return true;
    	} else {
    		return false;
    	}
    },
    dequeue: function(name) {
    	for(const [i, task] of Queue.tasks.entries()) {
			if(task.name === name) {
				Queue.tasks.splice(i, 1);
				return task.callback;
			}
		}
    }
}

module.exports = Queue;