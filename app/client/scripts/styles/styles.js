
define({
    loadStylesheet: function (stylesheet) {
        var element = document.createElement('link');
        element.setAttribute('rel', 'stylesheet');
        element.setAttribute('type', 'text/css');
        element.setAttribute('href', stylesheet);
        document.getElementsByTagName('head')[0].appendChild(element);
    }
});
