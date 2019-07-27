const express = require('express');
const path = require('path');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const port = process.env.PORT || 3000;
const app = express();

const usersRouter = require('./routes/users');
const beerRouter = require('./routes/beer');
const notFoundRouter = require('./routes/notFound');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, '../../dist')));
    app.get('/*', (req, res) => {
        res.sendFile(path.resolve('index.html'));
    });
}

app.use('/users', usersRouter);
app.use('/beers', beerRouter);
app.use('*', notFoundRouter);

app.listen(port, () => console.info(`server running on port ${port}`));

module.exports = app;
