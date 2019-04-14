'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let NoteSchema = new Schema({
    title: String,
    body: String,
    archived: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Note', NoteSchema);
