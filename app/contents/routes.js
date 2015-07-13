var express = require('express'),
    router = express.Router(),
    contentController = require('./controllers/content_controller');

router.get('/:project/:file', contentController.get);
router.put('/:project/:file', contentController.update);

module.exports = router;
