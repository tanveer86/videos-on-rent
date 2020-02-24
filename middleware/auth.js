const jwt = require('jsonwebtoken');
const config = require('config');

function auth(request, response, next) {
    const token = request.header('x-auth-token');
    if(!token) return response.send('access denied no token provided');
    
    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));     
        request.admin = decoded;   
        next();
    } catch (error) {
        response.send('invalid token id provided')
    }
}

module.exports = auth;