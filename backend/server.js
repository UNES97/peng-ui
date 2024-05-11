const fastify = require('fastify')(
    { 
        logger: true,
    }
)
const cors = require('@fastify/cors');
require('dotenv').config()

fastify.register(cors, {
    origin: "*"
})

fastify.listen({ port: process.env.APP_PORT || 3000, host: process.env.APP_HOST }, (err) => {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
})