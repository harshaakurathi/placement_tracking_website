const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    let bearerToken = req.headers.authorization;
    if (bearerToken === undefined) {
        return res.send({ message: "Unauthorized" });
    }
    let token = bearerToken.split(" ")[1];
    try {
        let decodedToken = jwt.verify(token, 'abcd');
        console.log(decodedToken)
        next(); 
    } catch (err) {
        res.send({ message: err.message }); // Change status to 403 for Forbidden
    }
};

module.exports = verifyToken;
