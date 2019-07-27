const express = require('express');
const { asyncHandler, globalErrorHandler } = require('../asyncHandler');
const BeerController = require('../controllers/beerController');
const DbClient = require('../db/dbClient');
const BeerModel = require('../models/beer.model');
const auth = require('./auth');
const tokenValidate = require('./tokenValidate');

const beerRouter = express.Router();

const dbClient = new DbClient(BeerModel);
const controller = new BeerController(dbClient);

beerRouter
    .get('/', auth.required, tokenValidate, asyncHandler(async (req, res) => {
        res.json(await controller.get(req.payload.id, req.query));
    }))
    .get('/id', auth.required, tokenValidate, asyncHandler(async (req, res) => {
        res.json(await controller.getById(req.payload.id, req.query));
    }))
    .post('/', auth.required, tokenValidate, asyncHandler(async (req, res) => {
        res.json(await controller.post(req.payload.id, req.body));
    }))
    .put('/:id', auth.required, tokenValidate, asyncHandler(async (req, res) => {
        res.json(await controller.update(req.params.id, req.body));
    }))
    .delete('/:id', auth.required, tokenValidate, asyncHandler(async (req, res) => {
        res.json(await controller.destroy(req.params.id));
    }));

beerRouter.use(globalErrorHandler());

module.exports = beerRouter;
