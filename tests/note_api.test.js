const mongoose = require('mongoose');
const app = require('../app');
const supertest = require('supertest');
const helper = require('./test_helper');
const Note = require('../models/note');
const api = supertest(app);



beforeEach(async()=>{
    await Note.deleteMany({});
    const noteObjects = helper.initialNotes
        .map(note=> new Note(note));
    const promiseArray = noteObjects.map(note=> note.save());
    await Promise.all(promiseArray);
})

test('notes are returned as json', async()=>{
    await api
        .get('/api/notes')
        .expect(200)
        .expect('Content-Type', /application\/json/);
        
})

test(`there are ${helper.initialNotes.length} notes`, async()=>{
    const response = await api.get('/api/notes');
    expect(response.body).toHaveLength(helper.initialNotes.length);
})

test(`the first note is`, async()=>{
    const response = await api.get('/api/notes');
    const firstNote = await helper.notesInDb();
    expect(response.body[0].content).toBe(firstNote[0].content);
})

test('a specific note is within the returned notes', async()=>{
    const response = await api.get('/api/notes');
    const contents = response.body.map(n=> n.content);
    expect(contents).toContain('Browser can execute only Javascript');
})

test('a valid note can be added ', async()=>{
    const newNote = {
        content: 'async/await simplifies making async calls',
        important: true,
    }
    await api
        .post('/api/notes')
        .send(newNote)
        .expect(201)
        .expect('Content-Type', /application\/json/);
    const notesAtEnd = await helper.notesInDb();
  
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1);
    const contents = notesAtEnd.map(n=> n.content);
    expect(contents).toContain(newNote.content);
})

test('a note without content is not added', async()=>{
    const newNote = {
        important: true
    }
    await api
        .post('/api/notes')
        .send(newNote)
        .expect(400);
    const notesAtEnd = await helper.notesInDb();
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length);
})

test('a specific note can be viewed', async()=>{
    const notesAtStart = await helper.notesInDb();
    const noteToView = notesAtStart[0];
    const result = await api
        .get(`/api/notes/${noteToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);

    const processedNoteToView = JSON.parse(JSON.stringify(noteToView));
    expect(result.body).toEqual(processedNoteToView);
})

test('a note can be deleted', async()=>{
    const notesAtStart = await helper.notesInDb();
    const noteToDelete = notesAtStart[0];
    await api
        .delete(`/api/notes/${noteToDelete.id}`)
        .expect(204);
    const notesAtEnd = await helper.notesInDb();
    expect(notesAtEnd).toHaveLength(notesAtStart.length - 1);

    const contents = notesAtEnd.map(n=>n.content);
    expect(contents).not.toContain(noteToDelete.content);

})

afterAll(()=>{
    mongoose.connection.close();
})