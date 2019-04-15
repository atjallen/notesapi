'use strict';

let cont = require('../controllers/notescontroller');

module.exports = (app) => {
    app.route('/notes')
        .get(cont.listNotes)
        .post(cont.createNote);

    app.route('/notes/:noteID')
        .get(cont.getNote)
        .patch(cont.updateNote)
        .delete(cont.deleteNote);
};
