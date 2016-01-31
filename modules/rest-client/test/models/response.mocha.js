var expect = require('chai').expect,
    assert = require('assert'),
    errors = require('../../errors'),
    models = require('../../models'),
    Response = models.Response;

describe('Response model', function () {

    it('rejects an invalid status code', function () {
        var initFn = Response.bind(Response, 1);
        expect(initFn).to.throw(assert.AssertionError, 'code must be a valid status code');
    });

    describe('instantiated model', function () {
        var model;

        describe('with a non-error status', function () {
            const status = 200;
            var headers,
                body;

            beforeEach(function () {
                headers = { 'X-Test-Header': 'value' };
                body = {};
                model = new Response(status, {
                    headers: headers, 
                    body: body
                });
            });

            it('extends from Message', function () {
                expect(model).to.be.an.instanceOf(models.Message);
            });

            it('is not an error', function () {
                expect(model.isError()).to.be.false;
                expect(model.getError()).is.undefined;
            });

            it('retrieves a header', function () {
                expect(model.getHeader('X-Test-Header')).to.equal('value');
                expect(model.getHeader('X-Madeup-Header')).to.be.undefined;
            });

            it('retrieves the body', function () {
                expect(model.getBody()).to.equal(body);
            });

            it('retrieves all headers', function () {
                expect(model.getHeaders()).to.equal(headers);
            });

            it('retrieves the code', function () {
                expect(model.getCode()).to.equal(status);
            });
        });

        describe('with a not-found status', function () {
            const status = 404;

            beforeEach(function () {
                model = new Response(status);
            });

            it('is an error', function () {
                expect(model.isError()).to.be.true;
            });

            it('decodes it as Not Found Error', function () {
                expect(model.getError()).to.be.an.instanceOf(errors.NotFound);
            });
        });

        describe('request error status', function () {
            const status = 400;

            beforeEach(function () {
                model = new Response(status);
            });

            it('is an error', function () {
                expect(model.isError()).to.be.true;
            });

            it('decdoes to a Request Error', function () {
                expect(model.getError()).to.be.an.instanceOf(errors.Request);
            });
        });

        describe('server error status', function () {
            const status = 500;

            beforeEach(function () {
                model = new Response(status);
            });

            it('is an error', function () {
                expect(model.isError()).to.be.true;
            });

            it('decodes to a Server Error', function () {
                expect(model.getError()).to.be.an.instanceOf(errors.Server);
            });
        });
    });
});