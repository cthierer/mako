
define(['utils/lodash', 'utils/objects', 'utils/promise'], function (_, ObjectUtil, Promise) {
    var Config = function (data) {
        if (!_.isObject(data)) {
            data = {};
        }

        this.get = function (property) {
            var deferred = Promise.pending();
            if (property) {
                deferred.resolve(ObjectUtil.get(data, property));
            } else {
                deferred.resolve(data);
            }
            return deferred.promise;
        };

        this.set = function (property, value) {
            var deferred = Promise.pending();
            deferred.resolve(ObjectUtil.set(data, property, value));
            return deferred.promise;
        };
    };

    return new Config({
        "mako": {
            "host": "http://localhost:3000",
            "endpoints": {
                "content": "/api/contents"
            }
        },
        "projects": [
            {
                "name": "great-white",
                "title": "GreatWhite"
            }
        ],
        "content": {
            "selectors": ["article", ".article", ".editable"]
        },
        "styles": {
            "stylesheets": ["//localhost:3000/client/styles/mako.css"],
            "classes": {
                "editable": "mako-editable"
            }
        },
        "editor": {
            "editorTemplate": "<div class=\"mako-edit\"><form class=\"mako-form\"><div class=\"form-group\"><label>Content<textarea class=\"form-control mako-md-editor\" name=\"content\"><%= content %></textarea></label></div><div class=\"mako-toolbar btn-group\" role=\"group\"><button type=\"button\" class=\"btn btn-default\" data-action=\"close\">Close</button><button type=\"submit\" class=\"btn btn-primary\">Preview</button></div></form></div>",
            "toolbar": {
                "toolbarTemplate": "<div class=\"mako-toolbar btn-group\" role=\"group\"><% _.each(buttons, function (button) { %><%= button.render(button) %><% }) %></div>",
                "buttonTemplate": "<button type=\"button\" class=\"btn btn-default\" data-article=\"<%= article.getId() %>\"><% if (icon) { %><span class=\"glyphicon glyphicon-<%= icon %>\" aria-hidden=\"true\"></span><% } %><%= label %></button>"
            }
        }
    });
})
