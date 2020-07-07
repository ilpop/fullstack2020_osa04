const express = require('express')
const blogRouter = express.Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

blogRouter.delete('/:id', async (request, response) => {
  const token = request.token

  const decodedToken = jwt.verify(token, process.env.SECRET)
  if(!token || !decodedToken.id) {
    return response.status(401).json({
      error: 'token missing or invalid'})
  }

  const userid = await User.findById(decodedToken.id)
  const blog = await Blog.findById(request.params.id)

  if ( blog.user.toString() === userid.toString() ) {

    const result = await Blog.findByIdAndRemove(request.params.id)
    response.status(204).json(result.toJSON())

  } else {
    return response(401).json({
      error : 'invalid access'
    })
  }

})


blogRouter.post('/', async (request, response) => {
  const body = request.body
  const token = request.token

  const decodedToken = jwt.verify(token, process.env.SECRET)
  if(!token || !decodedToken.id) {
    return response.status(401).json({ 
      error: 'token missing or invalid'})
  }


  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
    
  })

  if (body.title === undefined || body.url === undefined) {
    return response.status(400).json({ error: 'Bad request'})
  }

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  
  response.json(savedBlog.toJSON())
  
})



blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
    response.json(blogs.map(blog => blog.toJSON()))
  
  })


blogRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if(blog) {
    response.json(blog.toJSON())
  } else {
    response.status(404).end()

    }
  })
  



  blogRouter.put('/:id', async (request, response, next) => {
    const body = request.body

    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,

    }
  
    Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
      .then(updatedBlog => {
        response.json(updatedBlog.toJSON())
      })
      .catch(error => next(error))
  })

  module.exports = blogRouter