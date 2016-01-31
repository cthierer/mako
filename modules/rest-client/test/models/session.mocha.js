var expect = require('chai').expect,
    Session = require('../../models/session');

describe('Session model', function () {

    it('declares an authenticate method', function () {
        var model = new Session(),
            authFn = model.authenticate.bind(model);

        expect(authFn).to.throw(Error, 'not implemented');
    });

    it('declares a refresh method', function () {
        var model = new Session(),
            refreshFn = model.refresh.bind(model);

        expect(refreshFn).to.throw(Error, 'not implemented');
    });
});