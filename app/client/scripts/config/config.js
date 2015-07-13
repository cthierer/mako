
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
            "name": "Mako",
            "repo": "https://github.com/cthierer/mako",
            "host": "https://floating-wave-3756.herokuapp.com",
            "endpoints": {
                "content": "/api/contents"
            },
            "toolbar": {
                "toolbarTemplate": "<div class=\"mako-navbar navabar navbar-inverse navbar-fixed-bottom\">\
                    <div class=\"container-fluid\">\
                        <div class=\"navbar-header\">\
                            <span class=\"navbar-brand\">\
                                <span class=\"mako-icon\"><%= name %></span>\
                            </span>\
                        </div>\
                        <div id=\"mako-app-toolbar\" class=\"collapse navbar-collapse\">\
                            <ul id=\"mako-app-toolbar-main\" class=\"nav navbar-nav\">\
                            </ul>\
                            <div class=\"navbar-text navbar-right mako-repo-link\">\
                                <a href=\"<%= repo %>\" target=\"_blank\">\
                                    <img width=\"20px\" height=\"20px\" src=\"<%= host %>/client/images/GitHub-Mark-Light-32px.png\" alt=\"View source code on GitHub\"/>\
                                </a>\
                            </div>\
                            <ul id=\"mako-app-toolbar-secondary\" class=\"nav navbar-nav navbar-right\">\
                            </ul>\
                        </div>\
                    </div>\
                </div>",
                "loginTemplate": "<li><a href=\"#\"><%= text %></a></li>",
                "userTemplate": "<li><a href=\"#\"><%= user %></a></li>",
            },
            "panel": {
                "panelTemplate": "<div class=\"mako-panel panel panel-primary collapse\">\
                    <div class=\"panel-heading\">\
                        <h3 class=\"panel-title\">\
                            <%= title %>\
                            <a href=\"#\" class=\"close\">&times;</a>\
                        </h3>\
                    </div>\
                    <div class=\"panel-body\">\
                    </div>\
                </div>",
                "loginTemplate": "<form>\
                    <div class=\"form-group\">\
                        <label>\
                            Username\
                            <input class=\"form-control\" type=\"text\" name=\"username\" />\
                        </label>\
                    </div>\
                    <div class=\"form-group\">\
                        <label>\
                            Personal Access Token\
                            <input class=\"form-control\" type=\"password\" name=\"password\" />\
                        </label>\
                    </div>\
                    <button type=\"submit\" class=\"btn btn-primary\">Log in</button>\
                </div>",
                "userTemplate": "<dl>\
                    <dt>Username</dt><dd><%= username %></dd>\
                    <dt>Token</dt><dd><%= token %></dd>\
                </dl>"
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
            "stylesheets": ["<%= host %>/client/styles/mako.css"],
            "classes": {
                "editable": "mako-editable"
            }
        },
        "editor": {
            "editorTemplate": "<div class=\"mako-edit collapse\">\
                <form class=\"mako-form\">\
                    <div class=\"form-group\">\
                        <label>\
                            Content\
                            <textarea class=\"form-control mako-md-editor\" name=\"content\"><%= content %></textarea>\
                        </label>\
                    </div>\
                    <div class=\"form-group\">\
                        <label>\
                            Commit message\
                            <input required class=\"form-control\" name=\"message\" type=\"text\" value=\"<%= message %>\"/>\
                        </label>\
                    </div>\
                    <div class=\"mako-toolbar btn-group\" role=\"group\">\
                        <button type=\"button\" class=\"btn btn-default\" data-action=\"close\">Close</button>\
                        <button type=\"submit\" class=\"btn btn-primary\">Preview</button>\
                    </div>\
                </form>\
            </div>",
            "toolbar": {
                "toolbarTemplate": "<div class=\"mako-toolbar btn-group\" role=\"group\">\
                    <% _.each(buttons, function (button) { %>\
                        <%= button.render(button) %>\
                    <% }) %>\
                </div>",
                "buttonTemplate": "<button type=\"button\" class=\"btn btn-default\" data-article=\"<%= article.getId() %>\">\
                    <% if (icon) { %>\
                        <span class=\"glyphicon glyphicon-<%= icon %>\" aria-hidden=\"true\"></span>\
                    <% } %>\
                    <%= label %>\
                </button>"
            }
        }
    });
})
