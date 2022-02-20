const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    return jwt.sign({
        id: user._id,
        email: user.email,
        role: user.role,
        }, 'somethingsecret');
};

const isAuth = (req, res, next) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization; // Bearer xxxxxxx
        jwt.verify(token, 'somethingsecret', (err, decode) =>{
            if (err) {
                res.status(401).send({ message: 'jwt malformed' });
            } else {
                req.user = decode;
                
                next();
            }
        });
    } else {
        res.status(401).send({ message: 'missing auth token' });
    } 
};



module.exports = { generateToken, isAuth };