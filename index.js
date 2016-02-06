var logger = require('log4js').getLogger(),
    config = require('config'),
    restify = require('restify'),
    app = require('./server'),
    server = restify.createServer(),
    port = config.get('server.port') || 4000,
    router = new app.Router();

server.use(restify.queryParser());

router.apply(server, '/');

logger.info('Server configured:', "\n", server.toString());

server.listen(port, function () {
    logger.info('Server started, listening on port ', port);
});
