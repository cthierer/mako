var contentService = require('../services/content_service');

module.exports = {

    get: function (req, res, next) {
        var project = req.params.project,
            filename = req.params.file;

        contentService.getContent(project, filename).then(function (result) {
            res.send(result);
        }).catch(function (err) {
            next(err);
        });
    },

    update: function (req, res, next) {
        var project = req.params.project,
            filename = req.params.file,
            content = req.body.content,
            sha = req.body.sha,
            message = req.body.message,
            user = req.body.user;

        contentService.updateContent(project, filename, content, {
            sha: sha,
            message: message,
            user: user
        }).then(function (result) {
            res.send(result);
        }).catch(function (err) {
            next(err);
        });
    }

}
