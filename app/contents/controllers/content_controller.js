var contentService = require('../services/content_service');

module.exports = {

    get: function (req, res, next) {
        var project = req.params.project,
            filename = req.params.file;

        contentService.getContent(project, filename).then(function (content) {
            res.send({
                content: content
            });
        }).catch(function (err) {
            next(err);
        });
    }

}
