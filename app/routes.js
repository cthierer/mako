var express = require('express'),
    router = express.Router(),
    apiRouter = express.Router(),
    contentsRoutes = require('./contents/routes');

router.use(function (req, res, next) {
    res.set('Access-Control-Allow-Origin', '*');
    next();
});

router.get('/', function(req, res, next) {
  res.send({message: 'hello, world'});
});

apiRouter.use('/contents', contentsRoutes);

router.use('/client', express.static('app/client'));
router.use('/api', apiRouter);
router.use('/api/v1', apiRouter);

module.exports = router;
