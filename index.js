var logger = require('log4js').getLogger(),
    config = require('config'),
    server = require('restify').createServer(),
    port = config.get('server.port') || 4000;

server.get('/hello', function (req, res, next) {
    res.send('hello, world!');
    next();
});

server.listen(port, function () {
    logger.info('Server started, listening on port ', port);
});
