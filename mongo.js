const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const {REACT_APP_DATABASE_PASSWORD} = process.env; 
const {REACT_APP_DATABASE_NAME} = process.env;

if(process.argv.length < 3)
{
    console.log('Please provide the password as an argument: node mongo.js <password>');
    process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://fullstack:${REACT_APP_DATABASE_PASSWORD}@cluster0.3yj2s.mongodb.net/${REACT_APP_DATABASE_NAME}?retryWrites=true&w=majority`;

const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean
})
const Note = mongoose.model('Note', noteSchema);
/*mongoose
.connect(url)
.then((result) =>{
    console.log('connected!');
    const note = new Note({
        content: "Browser can execute only Javascript",
        date: new Date(),
        important: true,
    })
    return note.save();
})
.then(()=>{
    console.log('note saved!');
    return mongoose.connection.close();
})
.catch((err)=> console.log(err))*/
mongoose
.connect(url)
.then(()=>{
    Note.find({})
.then(result =>{
    result.forEach(note=>{console.log(note)});
    mongoose.connection.close();
})
})
