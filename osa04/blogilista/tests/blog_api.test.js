const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const { initialBlogs } = require('./test_helper')
const logger = require('../utils/logger')
const blog = require('../models/blog')

describe('when there is initially some blogs saved ', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
    
    
    let blogObject = new Blog(helper.initialBlogs[0])
    await blogObject.save()
    
    blogObject = new Blog(helper.initialBlogs[1])
        await blogObject.save()
    })

    test('blogs are returned as json', async () => {
        await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    
    })
    
    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')
    
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })
    
    test('new blog is added', async () => {
        const newBlog = {
            title: "Fun fun function", 
            author: "Mattias Petter Johannson",
            url:  "https://www.youtube.com/channel/UCO1cgjhGzsSYb1rsB4bFe4Q", 
            likes: 11, 
            __v: 0 
        }
    
        await api.post('/api/blogs')
                  .send(newBlog)
                  .expect(200)
                  .expect('Content-Type', /application\/json/)
    
        const blogsAtEnd = await helper.blogsInDB()
        expect(blogsAtEnd.length).toBe(helper.initialBlogs.length +1)
    
        const title = blogsAtEnd.map(b => b.title)
        expect(title).toContain(
            'Fun fun function'
        )
    })

    describe('deletion of a blog', () => {
        test('blog can be deleted', async () => {
               
            const response = await helper.blogsInDB()
            const idToDelete = response[0].id
            
            await api
            .delete(`/api/blogs/${idToDelete}`)
                    .expect(204)
        
                    const blogsAtEnd = await helper.blogsInDB()
        
                    expect(blogsAtEnd.length).toBe(
                        helper.initialBlogs.length -1)
                       
        })
    
    })


test('id is defined and not "_id" ', async () => {
    const response = await helper.blogsInDB()

    const id = response[0].id
    expect(id).toBeDefined()

})

test('likes is zero if it is left empty', async () => {

    const newBlog = {
        title: "Functional programming", 
        author: "Mattias Petter Johannson",
        url:  "https://www.youtube.com/channel/UCO1cgjhGzsSYb1rsB4bFe4Q", 
        __v: 0 
    }

    await api.post('/api/blogs')
              .send(newBlog)
              .expect(200)
              .expect('Content-Type', /application\/json/)

    const blogs = await helper.blogsInDB()
    const addedBlog = blogs.filter(blog => blog.title === "Functional programming")
    expect(addedBlog[0].likes).toBe(0)

})

test('if title and url is missing return Internal server error (400)', async () => {
    const newBlog = {
        
        author: "Mattias Petter Johannson", 
        __v: 0 
    }

    await api.post('/api/blogs')
              .send(newBlog)
              .expect(400)

    })
             
})

afterAll(() => {
    mongoose.connection.close()
})
