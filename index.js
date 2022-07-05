const http = require('http');
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const {REACT_APP_DATABASE_PASSWORD} = process.env; 
const {REACT_APP_DATABASE_NAME} = process.env;


const Note = require("./models/note");



app.use(express.json())
app.use(cors());
app.use(express.static('build'));

let notes = [
    {
      id: 1,
      content: "HTML is easy",
      date: "2022-05-30T17:30:31.098Z",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only Javascript",
      date: "2022-05-30T18:39:34.091Z",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      date: "2022-05-30T19:20:14.298Z",
      important: true
    }
  ]


app.get('/', (request, response) =>{
  response.send('<h1>Hello world!</h1>');
})

app.get('/api/notes', (request, response) =>{
  
  Note.find({})
  .then(notes=> {
    response.json(notes);
  });
})

app.get('/api/notes/:id', (request, response)=>{
  const id = Number(request.params.id);
  const note = notes.find(note=> note.id === id);
  console.log(note);
  if(note)
    response.json(note);
  else
    response.status(404).end();
})

app.delete('/api/notes/:id', (request, response) =>{
  const id = Number(request.params.id);
  notes = notes.filter(note => note.id !== id);
  console.log(notes);
  response.status(204).end();

})

app.post('/api/notes', (request, response) =>{
  const body = request.body;

  if(!body.content)
    return response.status(400).json({
      error: "content missing"
    })

    const generateId = () => {
      const maxId = notes.length > 0
        ? Math.max(...notes.map(n => n.id))
        : 0
      return maxId + 1
    }

  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId(),

  }
  

  console.log(note);
  notes = notes.concat(note);
  response.json(note);
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, ()=>{
  console.log(`Server running on port ${PORT}`);
})