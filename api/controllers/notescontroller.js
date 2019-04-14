'use strict';

let mongoose = require('mongoose'),
    Note = mongoose.model('Note');

exports.listNotes = (_, res) => {
    Note.find({}, (err, note) => {
        if (err) {
            res.send(err);
        }
        res.json(note);
    });
};

exports.createNote = (req, res) => {
    let newNote = new Note(req.body);
    newNote.save((err, note) => {
        if (err) {
            res.send(err);
        }
        res.json(note);
    });
};

exports.readNote = (req, res) => {
    Note.findById(req.params.noteID, (err, note) => {
        if (err) {
            res.send(err);
        }
        res.json(note);
    });
};

exports.updateNote = (req, res) => {
    Note.findAndUpdate({ _id: req.params.noteID }, req.body, { new: true }, (err, note) => {
        if (err) {
            res.send(err);
        }
        res.json(note);
    });
};

exports.deleteNote = (req, res) => {
    Note.remove({
        _id: req.params.noteID
    }, (err, _) => {
        if (err) {
            res.send(err);
        }
        res.json({ message: 'Note successfully deleted' });
    });
};
