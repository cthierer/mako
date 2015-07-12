
define(['marked', 'js-yaml'], function (marked, yaml) {
    return {
        render: marked,
        parse: function (markdown) {
            var result,
                fmBoundary = '---';

            function hasFrontMatter (markdown) {
                return markdown.substr(0, fmBoundary.length) === fmBoundary;
            }

            if (hasFrontMatter(markdown)) {
                var fmEnd = markdown.indexOf(fmBoundary, fmBoundary.length);
                if (fmEnd > 0) {
                    var fm = markdown.substr(fmBoundary.length, fmEnd - fmBoundary.length).trim(),
                        content = markdown.substr(fmEnd + fmBoundary.length).trimLeft();

                    result = {
                        properties: yaml.safeLoad(fm),
                        content: content
                    };
                }
            }

            if (!result) {
                result = {
                    properties: {},
                    content: markdown
                };
            }

            return result;
        }
    };
});
