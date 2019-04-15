'use strict';

let mongoose = require('mongoose'),
    Note = mongoose.model('Note');

function ErrorObject(status = null, title = null, detail = null, source = null) {
    if (status) {
        this.status = status;
    }
    if (title) {
        this.title = title;
    }
    if (detail) {
        this.detail = detail;
    }
    if (source) {
        this.source = source;
    }
}

const SERVER_ERROR = new ErrorObject(500, 'Server Error', 'The server encountered an error')

function APINote(dbNote) {
    if (!dbNote) {
        return null;
    }
    this.id = dbNote._id;
    this.type = 'note';
    this.attributes = {
        title: dbNote.title,
        body: dbNote.body,
        archived: dbNote.archived
    }
}

function DBNote(apiNote) {
    if (!apiNote) {
        return null;
    }
    this.title = apiNote.attributes.title;
    this.body = apiNote.attributes.body;
    this.archived = apiNote.attributes.archived;
}

let fullURL = (req) => {
    if (!req) {
        return null;
    }
    return req.protocol + '://' + req.get('host') + req.originalUrl;
}

exports.getAllNotes = (_, res) => {
    Note.find({}, (err, notes) => {
        if (err) {
            res.status(500).send({ errors: [SERVER_ERROR] });
            return;
        }
        res.status(200).json({ data: notes.map((note) => new APINote(note)) });
    });
};

exports.createNote = (req, res) => {
    let newNote = new Note(new DBNote(req.body.data));
    newNote.save((err, note) => {
        if (err) {
            res.status(500).send({ errors: [SERVER_ERROR] });
            return;
        }
        if (note) {
            res.set('Location', fullURL(req).split('?').shift() + '/' + note._id);
        }
        res.status(201).json({ data: new APINote(note) });
    });
};

exports.getNote = (req, res) => {
    Note.findById(req.params.noteID, (err, note) => {
        if (err) {
            switch (err.name) {
                case 'CastError':
                    res.status(400).send({ errors: [new ErrorObject(400, 'ID invalid', 'ID ' + req.params.noteID + ' invalid')] });
                    return;
                default:
                    res.status(500).send({ errors: [SERVER_ERROR] });
                    return;
            }
        }
        res.status(200).json({ data: note ? new APINote(note) : null });
    });
};

exports.updateNote = (req, res) => {
    Note.findOneAndUpdate({ _id: req.params.noteID }, new DBNote(req.body.data), { new: true }, (err, note) => {
        if (err) {
            switch (err.name) {
                case 'CastError':
                    res.status(400).send({ errors: [new ErrorObject(400, 'ID invalid', 'ID ' + req.params.noteID + ' invalid')] });
                    return;
                default:
                    res.status(500).send({ errors: [SERVER_ERROR] });
                    return;
            }
        }
        if (note) {
            res.status(200).json({ data: new APINote(note) });
        } else {
            res.status(404).json({ errors: [new ErrorObject(404, 'Note not found', 'No note with ID ' + req.params.noteID + ' could be found')] })
        }
    });
};

exports.deleteNote = (req, res) => {
    Note.deleteOne({ _id: req.params.noteID }, (err, results) => {
        if (err) {
            switch (err.name) {
                case 'CastError':
                    res.status(400).send({ errors: [new ErrorObject(400, 'ID invalid', 'ID ' + req.params.noteID + ' invalid')] });
                    return;
                default:
                    res.status(500).send({ errors: [SERVER_ERROR] });
                    return;
            }
        }
        if (results.deletedCount === 0) {
            res.status(404).send({ errors: [new ErrorObject(404, 'Note not found', 'No note with ID ' + req.params.noteID + ' could be found')] });
        } else {
            res.sendStatus(204);
        }
    });
};
