module.exports = {
  "extends": [
	  "plugin:react-hooks/recommended"
	],
  "env": {
    "commonjs": true,
    "node": true,
    "es6": true,
  },
  "parserOptions": {
    "ecmaVersion": 2020,
    "ecmaFeatures": {
	    "jsx": true
	  },
    "sourceType": "module"
  },
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}