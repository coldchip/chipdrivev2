function cssf(css, format) {
	var result = "";
	var tokens = format.split(" ");
	for(var token of tokens) {
		if(token.startsWith("!")) {
			result += token.substr(1) + ' ';
		} else {
			if(css[token]) {
				result += css[token] + ' ';
			}
		}
	}
	return result;
}

export default cssf;