const passport = require('passport');
const usersRouter = require('express').Router();
const auth = require('./auth');
const DbClient = require('../db/dbClient');
const UserModel = require('../models/user.model');
const UserController = require('../controllers/userController');
const tokenValidate = require('./tokenValidate');
const { asyncHandler, globalErrorHandler } = require('../asyncHandler');

require('../config/passport');

const dbClient = new DbClient(UserModel);
const controller = new UserController(dbClient);

usersRouter
    .post('/new', auth.optional, asyncHandler(async (req, res) => {
        res.json(await controller.post(req.body.user));
    }))
    .get('/current', auth.required, tokenValidate, asyncHandler(async (req, res) => {
        res.json(await controller.getById(req.payload.id));
    }))
    .delete('/current', auth.required, tokenValidate, asyncHandler(async (req, res) => {
        res.json(await controller.destroy(req.payload.id));
    }))
    .post('/current/logout', auth.required, tokenValidate, asyncHandler(async (req, res) => {
        res.json(await controller.logout(req.headers.authorization));
    }))
    .post('/login', auth.optional, async (req, res, next) => {
        const { body: { user } } = req;

        if (!user.email) {
            return res.status(422).json({
                errors: {
                    email: 'is required',
                },
            });
        }

        if (!user.password) {
            return res.status(422).json({
                errors: {
                    password: 'is required',
                },
            });
        }

        const validatedUser = await dbClient.findOne({ email: user.email });

        if (!validatedUser) {
            return res.status(404).json({
                errors: {
                    email: 'is not found',
                },
            });
        }

        const foundUser = new UserModel(validatedUser);

        if (!foundUser.validPassword(user.password)) {
            return res.status(401).json({
                errors: {
                    password: 'is incorrect',
                },
            });
        }

        return passport.authenticate('local', { session: false }, (err, passportUser) => {
            if (err) {
                return next(err);
            }

            if (passportUser) {
                const passUser = passportUser;
                passUser.token = passportUser.generateJWT();

                return res.json({ user: passUser.toAuthJSON() });
            }

            return res.status(400).info;
        })(req, res, next);
    });

usersRouter.use(globalErrorHandler());

module.exports = usersRouter;
