process.env.NODE_ENV = 'test';

const { assert } = require('chai');
const { Types } = require('mongoose');
const DbClient = require('../../db/dbClient');
const SampleBeer = require('../sampleBeer');
const BeerModel = require('../../models/beer.model');

describe('Db integration tests', () => {
    const dbClient = new DbClient(BeerModel);

    before(async () => {
        await dbClient.destroyAll();
    });

    describe('With a beer entry in the db', () => {
        const sampleBeer = new BeerModel(SampleBeer());
        let sample;
        let sampleId;

        before(async () => {
            sample = await dbClient.save(sampleBeer);
            sampleId = sample._id;
        });

        after(async () => {
            await dbClient.destroy(sampleId);
        });

        it('should get sample beer from the db on get call', async () => {
            const beerArr = await dbClient.findAll({});
            const beer = beerArr[0];
            const arrLen = 1;

            assert.strictEqual(beerArr.length, arrLen);
            assert.strictEqual(beer.name, sampleBeer.name);
            assert.strictEqual(beer.brewedBy, sampleBeer.brewedBy);
            assert.strictEqual(beer.type, sampleBeer.type);
            assert.strictEqual(beer.ibu, sampleBeer.ibu);
            assert.strictEqual(beer.rating, sampleBeer.rating);
            assert.strictEqual(beer.calories, sampleBeer.calories);
            assert.strictEqual(beer.comments, sampleBeer.comments);
            assert.isNotNull(beer._id);
            assert.isNotNull(beer.publisherId);
            assert.isNotNull(beer.createdAt);
            assert.isNotNull(beer.updatedAt);
        });

        it('should get the sample beer using find one method', async () => {
            const query = { name: sampleBeer.name };
            const beer = await dbClient.findOne(query);

            assert.strictEqual(beer.name, sampleBeer.name);
            assert.strictEqual(beer.brewedBy, sampleBeer.brewedBy);
            assert.strictEqual(beer.type, sampleBeer.type);
            assert.strictEqual(beer.ibu, sampleBeer.ibu);
            assert.strictEqual(beer.rating, sampleBeer.rating);
            assert.strictEqual(beer.calories, sampleBeer.calories);
            assert.strictEqual(beer.comments, sampleBeer.comments);
            assert.isNotNull(beer._id);
            assert.isNotNull(beer.publisherId);
            assert.isNotNull(beer.createdAt);
            assert.isNotNull(beer.updatedAt);
        });

        it('should get the sample beer by id', async () => {
            const beer = await dbClient.findById(sampleId);

            assert.strictEqual(beer.name, sampleBeer.name);
            assert.strictEqual(beer.brewedBy, sampleBeer.brewedBy);
            assert.strictEqual(beer.type, sampleBeer.type);
            assert.strictEqual(beer.ibu, sampleBeer.ibu);
            assert.strictEqual(beer.rating, sampleBeer.rating);
            assert.strictEqual(beer.calories, sampleBeer.calories);
            assert.strictEqual(beer.comments, sampleBeer.comments);
            assert.isNotNull(beer._id);
            assert.isNotNull(beer.publisherId);
            assert.isNotNull(beer.createdAt);
            assert.isNotNull(beer.updatedAt);
        });

        it('should update sample beer in the db', async () => {
            const updateParams = { name: 'updatedName' };
            const updatedBeer = await dbClient.update(sampleId, updateParams);

            assert.strictEqual(updatedBeer.name, updateParams.name);
        });

        it('should destroy the beer in the db with the id of sampleId', async () => {
            const success = await dbClient.destroy(sampleId);
            const deletedCount = 1;

            assert.strictEqual(success.deletedCount, deletedCount);

            const emptyGet = await dbClient.findAll({});
            assert.isEmpty(emptyGet);
        });
    });

    describe('Without a beer entry in the db', () => {
        const badId = '000000000000000000000000';

        before(async () => {
            await dbClient.destroyAll();
        });

        after(async () => {
            await dbClient.destroyAll();
        });

        it('should return an empty array on get call', async () => {
            const emptyArr = await dbClient.findAll({});

            assert.isEmpty(emptyArr);
            assert.isArray(emptyArr);
        });

        it('should return null when attempting to get a beer by id', async () => {
            const nullBeer = await dbClient.findById(Types.ObjectId(badId));

            assert.isNull(nullBeer);
        });

        it('should fail to update a non existent entry in the db', async () => {
            const params = { name: 'updatedName' };
            const badUpdate = await dbClient.update(badId, params);

            assert.isNull(badUpdate);
        });

        it('should return a delete count of 0 when attempting to destroy a non existent entry in the db', async () => {
            const deleteCount = 0;
            const badDelete = await dbClient.destroy(badId);

            assert.strictEqual(badDelete.deletedCount, deleteCount);
        });
    });

    describe('posting an item to the db', () => {
        const sampleBeer = new BeerModel(SampleBeer());

        beforeEach(async () => {
            await dbClient.destroyAll();
        });

        after(async () => {
            await dbClient.destroyAll();
        });

        it('should successfully post a valid beer entry to the db using post method', async () => {
            const newBeer = await dbClient.post(sampleBeer);
            const beerId = newBeer._id;

            assert.strictEqual(newBeer.name, sampleBeer.name);
            assert.strictEqual(newBeer.brewedBy, sampleBeer.brewedBy);
            assert.strictEqual(newBeer.type, sampleBeer.type);
            assert.strictEqual(newBeer.ibu, sampleBeer.ibu);
            assert.strictEqual(newBeer.rating, sampleBeer.rating);
            assert.strictEqual(newBeer.calories, sampleBeer.calories);
            assert.strictEqual(newBeer.comments, sampleBeer.comments);
            assert.isNotNull(newBeer._id);
            assert.isNotNull(newBeer.publisherId);
            assert.isNotNull(newBeer.createdAt);
            assert.isNotNull(newBeer.updatedAt);

            const beerFromDb = await dbClient.findById(beerId);
            const beerIdStr = beerId.toString();
            const beerFromDbIdStr = beerFromDb._id.toString();

            assert.strictEqual(beerIdStr, beerFromDbIdStr);
        });

        it('should fail post when beer entry is missing a required field using post method', async () => {
            const sample = SampleBeer();
            delete sample.name;

            const badSample = new BeerModel(sample);
            try {
                await dbClient.post(badSample);
            } catch (e) {
                return;
            }

            assert.fail();
        });

        it('should successfully post a valid beer entry to the db using save method', async () => {
            const myBeer = new BeerModel(SampleBeer());
            const newBeer = await dbClient.save(myBeer);
            const beerId = newBeer._id;

            assert.strictEqual(newBeer.name, sampleBeer.name);
            assert.strictEqual(newBeer.brewedBy, sampleBeer.brewedBy);
            assert.strictEqual(newBeer.type, sampleBeer.type);
            assert.strictEqual(newBeer.ibu, sampleBeer.ibu);
            assert.strictEqual(newBeer.rating, sampleBeer.rating);
            assert.strictEqual(newBeer.calories, sampleBeer.calories);
            assert.strictEqual(newBeer.comments, sampleBeer.comments);
            assert.isNotNull(newBeer._id);
            assert.isNotNull(newBeer.publisherId);
            assert.isNotNull(newBeer.createdAt);
            assert.isNotNull(newBeer.updatedAt);

            const beerFromDb = await dbClient.findById(beerId);
            const beerIdStr = beerId.toString();
            const beerFromDbIdStr = beerFromDb._id.toString();

            assert.strictEqual(beerIdStr, beerFromDbIdStr);
        });

        it('should fail post when beer entry is missing a required field using save method', async () => {
            const sample = SampleBeer();
            delete sample.name;

            const badSample = new BeerModel(sample);
            try {
                await dbClient.save(badSample);
            } catch (e) {
                return;
            }

            assert.fail();
        });
    });

    describe('updating an item in the db', () => {
        const sampleBeer = new BeerModel(SampleBeer());
        let sample;
        let sampleId;

        before(async () => {
            sample = await dbClient.post(sampleBeer);
            sampleId = sample._id;
        });

        after(async () => {
            await dbClient.destroyAll();
        });

        it('should successfully update an existing entry in the db', async () => {
            const update = { name: 'updatedName' };
            const updatedBeer = await dbClient.update(sampleId, update);

            assert.isNotNull(updatedBeer);
            assert.strictEqual(updatedBeer.name, update.name);
        });
    });

    describe('destroying an item in the db', () => {
        const sampleBeer = new BeerModel(SampleBeer());
        let sample;
        let sampleId;

        before(async () => {
            sample = await dbClient.post(sampleBeer);
            sampleId = sample._id;
        });

        after(async () => {
            await dbClient.destroyAll();
        });

        it('should destroy the entry with the specified id in the db', async () => {
            const deletedCount = 1;
            const deleted = await dbClient.destroy(sampleId);

            assert.strictEqual(deleted.deletedCount, deletedCount);

            const emptyFind = dbClient.findAll({});

            assert.isEmpty(emptyFind);
        });
    });

    describe('destroying all items in the db', () => {
        const sample1 = new BeerModel(SampleBeer());
        const sample2 = new BeerModel(SampleBeer());
        const sample3 = new BeerModel(SampleBeer());

        sample2.name = 'name2';
        sample3.name = 'name3';

        before(async () => {
            await dbClient.post(sample1);
            await dbClient.post(sample2);
            await dbClient.post(sample3);
        });

        after(async () => {
            await dbClient.destroyAll();
        });

        it('should destroy the entry with the specified id in the db', async () => {
            const deletedCount = 3;
            const deleted = await dbClient.destroyAll();

            assert.strictEqual(deleted.deletedCount, deletedCount);

            const emptyFind = dbClient.findAll({});

            assert.isEmpty(emptyFind);
        });
    });
});
