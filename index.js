var path = require('path').posix,
    logger = require('log4js').getLogger(),
    config = require('config'),
    restify = require('restify'),
    app = require('./server'),
    _ = require('lodash'),
    server = restify.createServer(),
    port = config.get('server.port') || 4000,
    rootPrefix = config.get('server.root_prefix') || '/',
    docConfig = config.get('documentation'),
    router = new app.Router();

// configure restify
server.use(restify.queryParser());
server.use(restify.bodyParser());

// documentation routes
// TODO modularize how this is configured 
// TODO figure out how to mount to rootPrefix 
if (docConfig.enabled) {
    var docPath = new RegExp(docConfig.route + '/?.*');

    if (logger.isInfoEnabled()) {
        logger.info('Enabling documentation on path', docPath);
    }

    server.get(docPath, restify.serveStatic({
        directory: docConfig.path || './dist',
        default: 'index.html'
    }));
} else if (logger.isInfoEnabled()) {
    logger.info('Skipping mounting documentation; not enabled...');
}

// web application routes 
// TODO modularize how this is configured 
server.get(/\/app\/?.*/, restify.serveStatic({
    directory: './dist',
    default: 'index.html'
}));

// set up routes
if (!_.isArray(rootPrefix)) {
    rootPrefix = [rootPrefix];
}

for (var i = 0; i < rootPrefix.length; i++) {
    var prefix = rootPrefix[i];

    if (logger.isDebugEnabled()) {
        logger.debug('Mounting application to path', prefix);
    }

    // application routes
    router.apply(server, prefix);
}

// done configuration, start the server
logger.info('Server configured:', "\n", server.toString());
server.listen(port, function () {
    logger.info('Server started, listening on port ', port);
});
