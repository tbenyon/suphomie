var assert = require('chai').assert;

var heating = require.main.require('root/../../modules/centralHeating/centralHeating.js');

describe('For the heating API', function() {
    describe('when getting the status', function() {
        it('should return a promise', function() {

            var status = heating.getStatus();

            assert.typeOf(status, 'promise');
        });
    });
});