const express = require('express');
const handler = require('../asyncHandler');

const notFoundRouter = express.Router();

notFoundRouter
    .get('/', (req, res) => {
        res.status(404).send('Page Not Found')
        }
    );

notFoundRouter.use(handler.globalErrorHandler());

module.exports = notFoundRouter;