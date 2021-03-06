const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const loginRouter = require('./controllers/login')
const blogRouter = require('./controllers/blog')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const usersRouter = require('./controllers/users')
const helper = require('./models/helper')
const Blog = require('./models/blog')
const User = require('./models/user')
const bcrypt = require ('bcrypt')
const { unknownEndPoint } = require('./utils/middleware')


/*const beforeEach = (async () => {
   
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'rootUser', passwordHash })

    await user.save()
   
})

beforeEach.call()*/

logger.info('connecting to ' + config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connection to MongoDB', error.message)
    })

app.use(cors())
app.use(express.json())

app.use(middleware.requestLogger)



app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(middleware.tokenExtractor)

app.use('/api/blogs', blogRouter)

app.use(unknownEndPoint)


module.exports = app