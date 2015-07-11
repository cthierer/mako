var express = require('express'),
    router = express.Router(),
    contentsRoutes = require('./contents/routes');

router.use(function (req, res, next) {
    res.set('Access-Control-Allow-Origin', '*');
    next();
});

router.get('/', function(req, res, next) {
  res.send({message: 'hello, world'});
});

router.use('/contents', contentsRoutes);

module.exports = router;
