process.env.NODE_ENV = 'test';

const request = require('supertest');
const { assert } = require('chai');
const { Types } = require('mongoose');
const DbClient = require('../../db/dbClient');
const UserController = require('../../controllers/userController');
const SampleUser = require('../sampleUser');
const UserModel = require('../../models/user.model');
const app = require('../../server');

describe('User API integration tests', () => {
    const userDbClient = new DbClient(UserModel);
    const userController = new UserController(userDbClient);

    after(async () => {
        await userDbClient.destroyAll();
    });

    describe('POST /users/new', () => {
        const sampleUser = SampleUser();

        afterEach(async () => {
            await userDbClient.destroyAll();
        });

        it('should create a new user and return the new user', async () => {
            const response = await request(app)
                .post('/users/new')
                .send({ user: sampleUser })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);

            assert.hasAllKeys(response.body, ['_id', 'name', 'username', 'email', 'salt', 'hash', 'createdAt', 'updatedAt', '__v']);
            assert.strictEqual(sampleUser.name, response.body.name);
        });

        it('should receive status code 500 for user without username field', async () => {
            const badSample = SampleUser();
            delete badSample.username;

            await request(app)
                .post('/users/new')
                .send({ user: badSample })
                .set('Accept', 'application/json')
                .expect(500);
        });

        it('should receive status code 500 for user without email field', async () => {
            const badSample = SampleUser();
            delete badSample.email;

            await request(app)
                .post('/users/new')
                .send({ user: badSample })
                .set('Accept', 'application/json')
                .expect(500);
        });

        it('should receive status code 500 for user without name field', async () => {
            const badSample = SampleUser();
            delete badSample.name;

            await request(app)
                .post('/users/new')
                .send({ user: badSample })
                .set('Accept', 'application/json')
                .expect(500);
        });

        it('should receive status code 500 for user without password field', async () => {
            const badSample = SampleUser();
            delete badSample.password;

            await request(app)
                .post('/users/new')
                .send({ user: badSample })
                .set('Accept', 'application/json')
                .expect(500);
        });
    });

    describe('POST /users/login', () => {
        const sampleUser = SampleUser();
        const sampleLogin = {
            user: {
                email: sampleUser.email,
                password: sampleUser.password,
            },
        };
        let user;
        let userId;

        before(async () => {
            user = await userController.post(sampleUser);
            userId = user._id;
        });

        after(async () => {
            await userDbClient.destroyAll();
        });

        it('should successfully log valid user in and return object with new token', async () => {
            const response = await request(app)
                .post('/users/login')
                .send(sampleLogin)
                .set('Accept', 'application/json')
                .expect(200);

            assert.hasAllKeys(response.body.user, ['_id', 'email', 'token']);
            assert.strictEqual(sampleUser.email, response.body.user.email);
        });
    });
});
