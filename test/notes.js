'use strict'

process.env.NODE_ENV = 'test';

let mongoose = require('mongoose'),
    Note = require('../api/models/notemodel'),
    chai = require('chai'),
    chaiHttp = require('chai-http'),
    server = require('../server'),
    expect = chai.expect;

chai.use(chaiHttp);

const apiNote = {
    type: "note",
    attributes: {
        title: 'Test title',
        body: 'Test body',
        archived: false
    }
}

const dbNote = {
    title: 'Test title',
    body: 'Test body',
    archived: false
}

describe('Notes', () => {

    beforeEach((done) => {
        Note.remove({}, (err) => {
            done()
        })
    });

    describe('Standard tests', () => {

        it('GET /notes gets all the notes', (done) => {
            let newNote1 = new Note(dbNote);
            newNote1.save((err, note1) => {
                let newNote2 = new Note(dbNote);
                newNote2.save((err, note2) => {
                    let newNote3 = new Note(dbNote);
                    newNote3.save((err, note3) => {
                        chai.request(server)
                            .get('/notes')
                            .end((err, res) => {
                                expect(res).to.have.status(200);
                                expect(res.body.data).to.be.a('array');
                                expect(res.body.data.length).to.be.eq(3);
                                done();
                            });
                    });
                });
            });
        });

        it('GET /notes/:noteID gets a note', (done) => {
            let newNote = new Note(dbNote);
            newNote.save((err, storedNote) => {
                chai.request(server)
                    .get('/notes/' + storedNote._id)
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body.data).to.have.property('id', storedNote._id.toString());
                        expect(res.body.data).to.have.property('type', 'note');
                        expect(res.body.data).to.have.property('attributes');
                        expect(res.body.data.attributes).to.have.property('title', apiNote.attributes.title);
                        expect(res.body.data.attributes).to.have.property('body', apiNote.attributes.body);
                        expect(res.body.data.attributes).to.have.property('archived', apiNote.attributes.archived);
                        done();
                    });
            });
        });

        it('POST /notes creates a note', (done) => {
            chai.request(server)
                .post('/notes')
                .send({ data: apiNote })
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res).to.have.header('Location');
                    expect(res.body.data).to.have.property('id');
                    expect(res.body.data).to.have.property('type', 'note');
                    expect(res.body.data).to.have.property('attributes');
                    expect(res.body.data.attributes).to.have.property('title', apiNote.attributes.title);
                    expect(res.body.data.attributes).to.have.property('body', apiNote.attributes.body);
                    expect(res.body.data.attributes).to.have.property('archived', apiNote.attributes.archived);
                    done();
                })
        });

        it('PATCH /notes/:noteID updates a note', (done) => {
            let testNote = new Note(dbNote);
            testNote.save((err, storedNote) => {
                let updateNote = new Object(apiNote);
                updateNote.id = storedNote._id;
                updateNote.attributes.title = 'New test title'
                updateNote.attributes.body = 'New test body'
                updateNote.attributes.archived = true;
                chai.request(server)
                    .patch('/notes/' + storedNote._id)
                    .send({ data: updateNote })
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body.data).to.have.property('id', storedNote._id.toString());
                        expect(res.body.data).to.have.property('type', 'note');
                        expect(res.body.data).to.have.property('attributes');
                        expect(res.body.data.attributes).to.have.property('title', updateNote.attributes.title);
                        expect(res.body.data.attributes).to.have.property('body', updateNote.attributes.body);
                        expect(res.body.data.attributes).to.have.property('archived', updateNote.attributes.archived);
                        done();
                    });
            });
        });

        it('DELETE /notes deletes all the notes', (done) => {
            new Note(dbNote).save((err, _) => {
                new Note(dbNote).save((err, _) => {
                    new Note(dbNote).save((err, _) => {
                        chai.request(server)
                            .delete('/notes')
                            .end((err, res) => {
                                expect(res).to.have.status(204);
                                Note.find({}, (err, notes) => {
                                    expect(notes).to.be.empty;
                                    done();
                                });
                            });
                    });
                });
            });
        });

        it('DELETE /notes/:noteID deletes a note', (done) => {
            new Note(dbNote).save((err, storedNote) => {
                chai.request(server)
                    .delete('/notes/' + storedNote._id)
                    .end((err, res) => {
                        expect(res).to.have.status(204);
                        Note.findOne({ _id: storedNote._id }, (err, deletedNote) => {
                            expect(deletedNote).to.be.null;
                            done();
                        });
                    });
            });
        });
    });

    describe('Edge cases', () => {

        describe('No notes', () => {

            it('GET /notes returns an empty array', (done) => {
                chai.request(server)
                    .get('/notes')
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body.data).to.be.a('array');
                        expect(res.body.data).to.be.empty;
                        done();
                    });
            });

            it('GET /notes/:noteID returns null', (done) => {
                chai.request(server)
                    .get('/notes/' + mongoose.Types.ObjectId())
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body.data).to.be.null;
                        done();
                    });
            });
        });
    });

    describe('Error testing', () => {

        describe('Invalid URL', () => {

            it('An HTTP request to an invalid URL returns a 404 error', (done) => {
                chai.request(server)
                    .get('/badURL')
                    .end((err, res) => {
                        expect(res).to.have.status(404);
                        done();
                    });
            });

        });

        describe('Invalid ID', () => {

            it('GET /notes/:noteID returns a 400 error', (done) => {
                chai.request(server)
                    .get('/notes/badID')
                    .end((err, res) => {
                        expect(res).to.have.status(400);
                        done();
                    });
            });

            it('PATCH /notes/:noteID returns a 400 error', (done) => {
                chai.request(server)
                    .patch('/notes/badID')
                    .end((err, res) => {
                        expect(res).to.have.status(400);
                        done();
                    });
            });

            it('DELETE /notes/:noteID returns a 400 error', (done) => {
                chai.request(server)
                    .delete('/notes/badID')
                    .end((err, res) => {
                        expect(res).to.have.status(400);
                        done();
                    });
            });

        });

        describe('Missing note', () => {

            it('PATCH /notes/:noteID returns a 404 error', (done) => {
                chai.request(server)
                    .patch('/notes/' + mongoose.Types.ObjectId())
                    .end((err, res) => {
                        expect(res).to.have.status(404);
                        done();
                    });
            });

            it('DELETE /notes/:noteID returns a 404 error', (done) => {
                chai.request(server)
                    .delete('/notes/' + mongoose.Types.ObjectId())
                    .end((err, res) => {
                        expect(res).to.have.status(404);
                        done();
                    });
            });

        });

    });
});
