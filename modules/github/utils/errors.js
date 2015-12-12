/**
 * Errors Util
 * @module github/utils/Errors
 */

var _ = require('lodash');

module.exports = {

    /**
     * Parse the specific error message from the GitHub client error message.
     * The GitHub Node module sometimes returns a JSON object as the message.
     * This parses that JSON object, and returns only the message attribute.
     * @see {@link http://mikedeboer.github.io/node-github/#HttpError}
     * @param {object} githubError The HttpError returned by the client.
     * @returns {string} The message to display for the error.
     */
    getErrorMessage: function (githubError) {
        var message;

        if (!githubError || !_.has(githubError, 'message')) {
            return message;
        }

        try {
            var decoded = JSON.parse(githubError.message);
            message = decoded.message;
        } catch (e) {
            message = githubError.message;
        }

        return message;
    }
}
