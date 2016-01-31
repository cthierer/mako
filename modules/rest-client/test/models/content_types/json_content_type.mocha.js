var expect = require('chai').expect,
    ContentType = require('../../../models/content_type'),
    JSONContentType = require('../../../models/content_types/json_content_type');

describe('JSON Content Type', function () {
    var model; 

    beforeEach(function () {
        model = new JSONContentType();
    });

    it('extends from Content Type', function () {
        expect(model).to.be.an.instanceOf(ContentType);
    });

    it('encodes an object into a JSON string', function () {
        var obj = { test: 'value' },
            result = model.encode(obj);
        expect(result).to.be.a('string')
            .that.equals(JSON.stringify(obj));
    });

    it('encodes an array into a JSON array', function () {
        var arr = ['one', 'two', 'three'],
            result = model.encode(arr);
        expect(result).to.be.a('string')
            .that.equals(JSON.stringify(arr));
    });

    it('ignores encoding non-JSON friendly entities', function () {
        expect(model.encode(123)).to.equal('');
        expect(model.encode(true)).to.equal('');
    });

    it('decodes a string into an object', function () {
        var str = JSON.stringify({test:'value'});
        expect(model.decode(str)).to.be.an('object')
            .with.property('test','value');
    });

    it('decodes an string into an array', function () {
        var str = JSON.stringify(['one','two','three']);
        expect(model.decode(str)).to.be.an('array')
            .with.length(3);
    });

    it('ignores decoding non-strings', function () {
        expect(model.decode(123)).to.be.empty;
        expect(model.decode(true)).to.be.empty;
    });

    it('ignores decoding empty strings', function () {
        expect(model.decode('')).to.be.empty;
    });

    it('errors when decoding an invalid string', function () {
        var decodeFn = model.decode.bind(model, 'lorem ipsum');
        expect(decodeFn).to.throw(Error);
    });
});