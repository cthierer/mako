/**
 * Request model
 * @module rest-client/models/Request
 */

 var util = require('util'), 
     assert = require('assert'),
     _ = require('lodash'),
     Promise = require('bluebird'),
     Message = require('./message'),
     Body = require('./body'),
     Response = require('./response'),
     Session = require('./session'),
     ContentType = require('./content_type'),
     errors = require('../errors');

/**
 * @class
 * @extends {module:rest-client/models/Message}
 * @param {http.ClientRequest} clientRequest
 */
var Request = function (clientRequest) {
    var deferredResponse = Promise.pending(),
        requestSent = false;

    // TODO don't like using requestSent as a state variable 

    Message.call(this);

    assert(!_.isNull(clientRequest), 'clientRequest must not be null');
    assert(!_.isUndefined(clientRequest), 'clientRequest must be defined');

    // listen for when the client gets a response
    clientRequest.on('response', function (raw) {
        var bodyContent = '';

        // generate the body as data is available 
        raw.on('data', function (chunk) {
            bodyContent += chunk;
        });

        // full response recieved, convert into a response and return 
        raw.on('end', function () {
            var headers = raw.headers, 
                contentTypeValue = headers[ContentType.HEADER],
                contentType = ContentType.Factory.findMatch(contentTypeValue),
                response;

            // handle unknown content type
            // TODO should this default to basic text? 
            if (!contentType) {
                deferred.reject(new errrors.UnknownContentType(contentTypeValue));
                return;
            }

            // TODO body must be manually decoded - make this implicit 
            response = new Response(raw.statusCode, {
                headers: headers,
                body: new Body(contentType.decode(bodyContent), contentType)
            });

            // handle if the response itself resulted in an error 
            if (response.isError()) {
                deferredResponse.reject(response.getError());
            } else {
                deferredResponse.resolve(response);
            }
        });
    });

    clientRequest.on('error', function (err) {
        deferredResponse.reject(err);
    });

    /**
     * @returns {http.ClientRequest}
     */
    this.getClientRequest = function () {
        return clientRequest;
    };

    /**
     * @param {string} key 
     * @returns {string} 
     */
    this.getHeader = function (key) {
        return clientRequest.getHeader(key);
    };

    /**
     * @returns {boolean}
     */
    this.isSent = function () {
        return requestSent;
    };

    /**
     * @params {module:rest-cleint/models/body} body
     * @returns {bluebird.Promise}
     */
    this.send = function (body) {

        // optionally, provide a body (shortcut for writing and then sending)
        if (body) {
            this.writeBody(body);
        }

        requestSent = true;

        clientRequest.end();

        return deferredResponse.promise;
    };

    /**
     * @param {string} key
     * @param {string} value
     * @throws {module:rest-client/errors/InvalidState} If additional headers
     *  cannot be sent, because the request has already been sent to the
     *  remote server.
     * @throws {assert.AssertionError} If either parameter is not a valid string.
     */
    this.setHeader = function (key, value) {
        assert(_.isString(key), 'key must be a string');
        assert(_.isString(value), 'value must be a string');

        if (requestSent) {
            throw new errors.InvalidState('request already sent');
        }

        clientRequest.setHeader(key, value);
    };

    /**
     * @param {module:rest-client/models/body} body
     * @throws {module:rest-client/errors/InvalidState} If the body cannot be
     *  sent, because the request has already been sent to the remote server.
     * @throws {assert.AssertionError} If the provided parameter is not a valid
     *  Body object.
     */
    this.writeBody = function (body) {
        assert(body instanceof Body, 'body must be an instance of Body');

        if (requestSent) {
            throw new errors.InvalidState('request already sent');
        }

        clientRequest.write(body.getHttpContent());
    };
};

util.inherits(Request, Message);

module.exports = Request;
