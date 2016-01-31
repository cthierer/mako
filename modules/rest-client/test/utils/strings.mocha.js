var expect = require('chai').expect,
    assert = require('assert'),
    stringsUtil = require('../../utils/strings');

describe('strings utility', function () {
    const nonStrings = [null, undefined, 123, 123.456, true];

    describe('equality ignoring case', function () {

        it('identifies matching strings', function () {
            var test = 'lorem ipsum', 
                against = ['lorem ipsum', 'Lorem Ipsum', 'LOREM IPSUM', 
                    'lOrem ipsUm'];

            for (var i = 0; i < against.length; i++) {
                expect(stringsUtil.equalsIgnoreCase(test, against[i])).to.be.true;
            }
        });

        it('handles non-matching strings', function () {
            var test = 'lorem ipsum', 
                against = ['jibberish', ' lorem ipsum', 'lorem ipsum ', 
                    ' lorem ipsum ', 'lorem  ipsum'];

            for (var i = 0; i < against.length; i++) {
                expect(stringsUtil.equalsIgnoreCase(test, against[i])).to.be.false;
            }
        });

        it('handles non-string parameters', function () {
            for (var i = 0; i < nonStrings.length; i++) {
                var val = nonStrings[i], 
                    strVal = val ? val.toString() : '';

                expect(stringsUtil.equalsIgnoreCase(val, val)).to.be.false;
                expect(stringsUtil.equalsIgnoreCase(val, strVal)).to.be.false;
                expect(stringsUtil.equalsIgnoreCase(strVal, val)).to.be.false;
            }
        });
    });

    describe('equality predicate', function() {

        it('validates that value is a string', function () {
            for (var i = 0; i < nonStrings.length; i++) {
                var fn = stringsUtil.equalsPredicate.bind(stringsUtil, nonStrings[i]);
                expect(fn).to.throw(assert.AssertionError, 'value must be a string');
            }
        });

        describe('returned function', function () {
            var result;

            beforeEach(function () {
                result = stringsUtil.equalsPredicate('lorem ipsum');
            });

            it('is a function', function () {
                expect(result).to.be.a.function;
            });

            it('tests equality', function () {
                expect(result('lorem ipsum')).to.be.true;
                expect(result('jibberish')).to.be.false;
            });

            it('ignores case when testing equality', function () {
                expect(result('LOREM IPSUM')).to.be.true;
            });

            it('handles non-string parameters', function () {
                for (var i = 0; i < nonStrings.length; i++) {
                    expect(result(nonStrings[i])).to.be.false;
                }
            });
        });
    });
});