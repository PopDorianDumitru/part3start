const mongoose = require('mongoose');
const path = require('path');
const config = require('../utils/config');
const url = config.MONGODB_URI;

mongoose.connect(url);
    

const noteSchema = new mongoose.Schema({
    content:{ 
        type:String,
        required: true,
        minLength: 5
    },
    date:{
        type: Date,
        required: true
    },
    important: Boolean,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

noteSchema.set('toJSON', {
    transform: (document, returnedObject)=>{
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})

module.exports = mongoose.model('Note', noteSchema);