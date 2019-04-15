'use strict';

let mongoose = require('mongoose'),
    Note = mongoose.model('Note');

/**
 * An error object to be returned in a response when an error occurs
 * @param {number} status The status code of the error
 * @param {string} title The title of the error
 * @param {string} detail A detailed message describing the error
 */
function ErrorObject(status = null, title = null, detail = null) {
    if (status) {
        this.status = status;
    }
    if (title) {
        this.title = title;
    }
    if (detail) {
        this.detail = detail;
    }
}

const SERVER_ERROR = new ErrorObject(500, 'Server Error', 'The server encountered an error')

/**
 * A note object to be sent over the API
 * @param {DBNote} dbNote The database note to convert
 */
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

/**
 * A note object to be stored in the database
 * @param {APINote} apiNote The API note to convert
 */
function DBNote(apiNote) {
    if (!apiNote) {
        return null;
    }
    this.title = apiNote.attributes.title;
    this.body = apiNote.attributes.body;
    this.archived = apiNote.attributes.archived;
}

/**
 * Returns the full URL of a request (without queries)
 * @param {object} req The Express request to get the URL of
 */
let fullURL = (req) => {
    if (!req) {
        return null;
    }
    return req.protocol + '://' + req.get('host') + req.originalUrl;
}

/**
 * Gets all the notes in the database
 */
exports.getAllNotes = (req, res) => {
    Note.find({}, (err, notes) => {
        if (err) {
            switch (err.name) {
                default:
                    res.status(500).send({ errors: [SERVER_ERROR] });
                    return;
            }
        }
        res.status(200).json({ data: notes.map((note) => new APINote(note)) });
    });
};

/**
 * Creates a new note in the database and returns it
 */
exports.createNote = (req, res) => {
    let newNote = new Note(new DBNote(req.body.data));
    newNote.save((err, note) => {
        if (err) {
            switch (err.name) {
                default:
                    res.status(500).send({ errors: [SERVER_ERROR] });
                    return;
            }
        }
        if (note) {
            res.set('Location', fullURL(req).split('?').shift() + '/' + note._id);
        }
        res.status(201).json({ data: new APINote(note) });
    });
};

/**
 * Gets a note from the database
 */
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

/**
 * Updates a note in the database and returns the update note
 */
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

/**
 * Deletes a note in the database
 */
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

/**
 * Deletes all notes in the database
 */
exports.deleteAllNotes = (req, res) => {
    Note.deleteMany({}, (err, results) => {
        if (err) {
            switch (err.name) {
                default:
                    res.status(500).send({ errors: [SERVER_ERROR] });
                    return;
            }
        }
        res.sendStatus(204);
    });
}
