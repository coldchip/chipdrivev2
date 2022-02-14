class ResponseCode {
	static SUCCESS = 1 << 0;
	static ERROR   = 1 << 1;
	static LOGIN   = 1 << 2;
}

module.exports = ResponseCode || {};