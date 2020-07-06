const bcrypt = require('bcrypt')
const supertest = require('supertest')
const User = require('../models/user')
const helper = require('./test_helper')
const app = require('../app')

const mongoose = require('mongoose')

const api = supertest(app)


describe('when there is initially one user at db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'rootUser', passwordHash })

        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
        
            username: 'iihalainen',
            name: 'Ilkka Ihalainen',
            password: 'salainen',

        }

        await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length +1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test('if password is under three  letters return error (400)', async () => {
        const users = await helper.usersInDb()

        const newUser = {
            username: 'ilpop',
            name: 'iilkka',
            password: 'ii',
        }

        
        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

            const usersAtEnd = await helper.usersInDb()
            expect(usersAtEnd.length).toBe(users.length)
                
    
        })

        test('if username is under three  letters return error (400)', async () => {
            const users = await helper.usersInDb()

            const newUser = {
                username: 'i',
                name: 'iilkka',
                password: 'iiii',
            }
    
            await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
                .expect('Content-Type', /application\/json/)
                    
                const usersAtEnd = await helper.usersInDb()
                expect(usersAtEnd.length).toBe(users.length)
        
            })
                 
    })
    
    afterAll(() => {
        mongoose.connection.close()
    
})