/**
 * Data Service 
 * @module database/DataService
 */

var assert = require('assert'),
    _ = require('lodash'),
    Knex = require('knex'),
    Bookshelf = require('bookshelf');

/**
 * @class
 * @param {object} connection (required)
 */
var DataService = function (connection) {
    var models = {},
        knex,
        bookshelf;

    assert(_.isObject(connection) && connection, 'connection must be defined');

    // initiate a knex connection 
    // TODO should this be an injected dependency? 
    knex = new Knex({
        client: 'pg',
        connection: connection,
        debug: true
    });

    // initiate a bookshelf instance 
    bookshelf = new Bookshelf(knex);

    /**
     * @param {string} name
     * @param {object} definition
     * @returns {bookshelf.Model}
     */
    this.addModel = function (name, definition) {
        assert(_.isString(name) && !_.isEmpty(name), 
            'name must be a non-empty string');
        assert(!_.has(models, name), 
            'model must not already be defined');
        assert(_.isObject(definition) && definition,
            'definition must be a valid object');

        models[name] = bookshelf.Model.extend(definition);

        return models[name];
    };

    /**
     * @returns {bookshelf}
     */
    this.getMapper = function () {
        return bookshelf;
    };

    /**
     * @param {string} name
     * @returns {bookshelf.Model}
     */
    this.getModel = function (name) {
        return models[name];
    };

    /**
     * @param {string} name
     * @returns {boolean}
     */
    this.hasModel = function (name) {
        return _.has(models, name);
    };
};

module.exports = DataService;