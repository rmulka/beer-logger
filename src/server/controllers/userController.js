const ResponseError = require('../responseError');
const Users = require('../models/user.model');
const BlacklistModel = require('../models/tokenBlacklist.model');
const DbClient = require('../db/dbClient');

class UserController {
    constructor(dbClient) {
        this.dbClient = dbClient;
    }

    async get(query) {
        const users = await this.dbClient.findAll(query);

        if (!users.length) {
            throw new ResponseError(400, 'No users found');
        }

        return users;
    }

    async getById(id) {
        const user = await this.dbClient.findById(id);

        if (!user) {
            throw new ResponseError(400, `No user found with id ${id}`);
        }

        return user;
    }

    async post(user) {
        let finalUser;
        try {
            finalUser = new Users(user);
        } catch (e) {
            throw new Error(e.message);
        }
        finalUser.setPassword(user.password);

        const newUser = await this.dbClient.save(finalUser);

        if (!newUser) {
            throw new ResponseError(500, 'failed to create new user');
        }

        return newUser;
    }

    async update(id, params) {
        const updatedBeer = await this.dbClient.update(id, params);

        if (!updatedBeer) {
            throw new ResponseError(400, `Could not update user with id ${id}`);
        }

        return updatedBeer;
    }

    async destroy(id) {
        const deletedUser = await this.dbClient.destroy(id);

        if (!deletedUser.deletedCount) {
            throw new ResponseError(400, `Could not delete user with id ${id}`);
        }

        return deletedUser;
    }

    async logout(authorization) {
        const blacklistDb = new DbClient(BlacklistModel);
        const token = authorization.split(' ')[1];
        await this.dbClient.connect();
        const tokenObj = new BlacklistModel({ token });
        try {
            return await blacklistDb.save(tokenObj);
        } catch (e) {
            throw new Error(e.message);
        }
    }
}

module.exports = UserController;
