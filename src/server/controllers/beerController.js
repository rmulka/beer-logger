const ResponseError = require('../responseError');
const Beer = require('../models/beer.model');

class BeerController {
    constructor(dbClient) {
        this.dbClient = dbClient;
    }

    async get(userId, query) {
        query.publisherId = userId;
        const beers = await this.dbClient.findAll(query);

        if (!beers.length) {
            throw new ResponseError(400, 'No beers found');
        }

        return beers;
    }

    async getById(userId, beerId) {
        const beer = await this.get(userId, { _id: beerId });

        if (!beer) {
            throw new ResponseError(400, `No beer found with id ${beerId}`);
        }

        return beer;
    }

    async post(userId, beer) {
        beer.publisherId = userId;
        const beerObj = new Beer(beer);
        const newBeer = await this.dbClient.post(beerObj);

        if (!newBeer) {
            throw new ResponseError(400, 'Could not create new beer');
        }

        return newBeer;
    }

    async update(beerId, params) {
        const updatedBeer = await this.dbClient.update(beerId, params);

        if (!updatedBeer) {
            throw new ResponseError(400, `Could not update beer with id ${beerId}`);
        }

        return updatedBeer;
    }

    async destroy(beerId) {
        const deletedBeer = await this.dbClient.destroy(beerId);

        if (!deletedBeer.deletedCount) {
            throw new ResponseError(400, `Could not delete beer with id ${beerId}`);
        }

        return deletedBeer;
    }
}

module.exports = BeerController;
