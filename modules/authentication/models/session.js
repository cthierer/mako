/**
 * Session model 
 * @module authentication/models/Session
 */

/**
 * @param {string} name
 * @param {module:database/DataService} dataService
 * @returns {bookshelf.Model}
 */
module.exports = function (name, dataService) {
    return dataService.addModel(name, {
        tableName: 'sessions',
        hasTimestamps: true
    });
};