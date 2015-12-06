var logger = require('log4js').getLogger(),
    config = require('config'),
    server = require('restify').createServer(),
    routes = require('./routes')(server),
    port = config.get('server.port') || 4000;

server.listen(port, function () {
    logger.info('Server started, listening on port ', port);
});
