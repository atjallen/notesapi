'use strict'

let express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    Note = require('./api/models/notemodel'),
    routes = require('./api/routes/noteroutes');

let app = express(),
    port = process.env.PORT || 3000;

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
//Replace this with your own connection string:
mongoose.connect('mongodb://localhost/NotesDB');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header('Content-Type', 'application/vnd.api+json');
    next();
});
routes(app);
app.use((req, res) => {
    res.status(404).send({ error: req.originalUrl + ' not found' })
});
app.listen(port);

console.log('Notes API started on port ' + port);

module.exports = app;
