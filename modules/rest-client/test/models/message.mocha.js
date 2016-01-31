var expect = require('chai').expect, 
    Message = require('../../models/message');

describe('Message model', function () {

    it('defines a method to retrieve a header', function () {
        var model = new Message(), 
            getHeaderFn = model.getHeader.bind(model);
        expect(getHeaderFn).to.throw(Error, 'not implemented');
    });
});