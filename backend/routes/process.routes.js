const { main } = require('../controllers/process.controller');

module.exports = function (fastify, opts, done) {
    fastify.post('/generate', { }, main)
    done()
}