const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    // next method is the logic that we have to execute after executing this logic
    // we will get token in the request.header
    try {
        // get token from frontend
        const token = req.header("authorization").split(" ")[1];
        const decryptedToken = jwt.verify(token, process.env.jwt_secret);
        req.body.userId = decryptedToken.userId;
        next();
    } catch (error) {
        res.send({
            success:false,
            message:error.message,
        })
    }
}