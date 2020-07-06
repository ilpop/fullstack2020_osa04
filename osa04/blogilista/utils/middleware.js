const logger = require('./logger')

const requestLogger = (request, resonse, next) => {
    logger.info('Method: ', request.method)
    logger.info('Path: ', request.path)
    logger.info('Body: ', request.body)
    logger.info('---')
    next()
}

const unknownEndPoint= (request, response) => {
    response.satus(404).send({ error: 'unknown endpoint'})

}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if(error.name === 'CastError' && error.kind === 'ObjectId') {
        return response.status(400).send({ error: 'malformated id'})
    } else if (error.name === 'ValidationError') {
        return response.satus(400).json({ error: error.message})
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({
            error: 'invalid token'
        })
    }

    logger.error(error.message)
    
    next(error)
}

module.exports = {
    requestLogger,
    unknownEndPoint,
    errorHandler
}