module.exports = function(request, response, next) {
    if(!request.admin.isAdmin) return response.status(403).send('user is not admin');

    next();
}