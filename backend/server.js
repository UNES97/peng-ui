const fastify = require('fastify')(
    { 
        logger: true,
    }
)
const cors = require('@fastify/cors');
require('dotenv').config()
const path = require('node:path');

fastify.register(require('@fastify/multipart'), { 
    attachFieldsToBody: true,
    limits: {
        fieldNameSize: 100, // Max field name size in bytes
        fieldSize: 100,     // Max field value size in bytes
        fields: 10,         // Max number of non-file fields
        fileSize: 5000000,  // For multipart forms, the max file size in bytes
        files: 1,           // Max number of file fields
        headerPairs: 2000,  // Max number of header key=>value pairs
        parts: 1000         // For multipart forms, the max number of parts (fields + files)
    }
});
fastify.register(cors, {
    origin: "*"
})

fastify.register(require('./routes/process.routes') , {prefix: 'api'})

fastify.listen({ port: process.env.APP_PORT || 3000, host: process.env.APP_HOST }, (err) => {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
})