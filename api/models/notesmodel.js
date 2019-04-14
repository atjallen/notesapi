'use strict';
import { Schema, model } from 'mongoose';

let NotesSchema = new Schema({
    title: String,
    body: String,
    archived: {
        type: Boolean,
        default: false
    }
});

export default model('Notes', NotesSchema);
