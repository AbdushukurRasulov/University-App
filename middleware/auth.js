const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
    
    const token = req.header('x-auth-token');

    if(!token) {
        return res.status(401).json({ msg: 'Acesso negado!'});
    }

    try {
        jwt.verify(token, 'Knowledge1sp#wer', (error, decoded) => {
            if(error){
                return res.status(401).json({ msg: 'Token is not valid' });
            } else {
                req.user = decoded.user;
                next();
            }
        });
    } catch (error) {
        console.error('something wrong with auth middleware');
        res.status(500).json({ msg: 'Server Error' });
    }
};