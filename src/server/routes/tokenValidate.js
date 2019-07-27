const DbClient = require('../db/dbClient');
const blacklistModel = require('../models/tokenBlacklist.model');
const ResponseError = require('../responseError');

const dbClient = new DbClient(blacklistModel);

module.exports = async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const blacklistedToken = await dbClient.findAll({ token });
    if (blacklistedToken.length) {
        return next(new ResponseError(401, 'Unauthorized token'));
    }
    return next();
};
