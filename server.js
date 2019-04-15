'use strict'

let express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    Note = require('./api/models/notemodel'),
    routes = require('./api/routes/noteroutes'),
    config = require('config');

let app = express(),
    port = process.env.PORT || 3000;

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect(config.DBHost);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
routes(app);
app.use((req, res) => {
    res.status(404).send({ error: req.originalUrl + ' not found' })
});
app.listen(port);

console.log('Notes server started on port ' + port);

module.exports = app;
