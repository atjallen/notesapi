'use strict'

let express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    Note = require('./api/models/notesmodel'),
    routes = require('./api/routes/notesroutes');

let app = express(),
    port = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost/NotesDB');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
routes(app);
app.listen(port);

console.log('Notes server started on port ' + port);
