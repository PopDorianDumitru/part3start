const User = require('../models/user');
const bcrypt = require('bcrypt');
const app = require('../app');
const supertest = require('supertest');
const api = supertest(app);
const mongoose = require('mongoose');
const helper = require('./test_helper');
describe('when there is initially one user in the db', ()=>{
    beforeEach(async()=>{
        await User.deleteMany({});
        const passwordHash = await bcrypt.hash('sekret', 10);
        const user = new User({username: 'root', passwordHash});
        await user.save();
    })

    test('Creation succeeds with a fresh username', async()=>{
        const usersAtStart = await helper.usersInDb();
        const newUser = {
            username: 'mlukkai',
            name: 'Matti Luukakein',
            password: 'mattoalta'
        }
        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/);
        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);
        const usernames = usersAtEnd.map(user=> user.username);
        expect(usernames).toContain(newUser.username);
    })

    test('Creation fails when the username is not unique', async()=>{
        const usersAtStart = await helper.usersInDb();
        const user = {
            username: 'root',
            name: 'Abdullah',
            password: 'hardtobreak'
        }
        const result = await api
            .post('/api/users')
            .send(user)
            .expect(400)
            .expect('Content-Type', /application\/json/);
        expect(result.body.error).toContain('username must be unique');
        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toEqual(usersAtStart);
    })

})