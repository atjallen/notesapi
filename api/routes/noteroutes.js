'use strict';

let cont = require('../controllers/notecontroller');

module.exports = (app) => {
    app.route('/notes')
        .get(cont.getAllNotes)
        .post(cont.createNote);

    app.route('/notes/:noteID')
        .get(cont.getNote)
        .patch(cont.updateNote)
        .delete(cont.deleteNote);
};
