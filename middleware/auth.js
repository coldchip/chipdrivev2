const db = require("./../models");

const User = db.user;
const Token = db.token;

function auth(req, res, next) {
	var token = req.headers.token ? req.headers.token : req.query.token;

    if(token) {
        Token.findOne({ 
            where: { 
                id: token
            },
            include: [{
            	model: User,
            	required: true
            }]
        }).then((token) => {
            if(token) {
                req.user = token.user;
                next();
            } else {
                return res.status(401).json({
                    message: "Unauthorized"
                });
            }
        });
    } else {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

}

module.exports = auth;