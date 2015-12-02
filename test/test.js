var r = require('./../index.js');
console.log(process.env);
//console.log(r('asdf'));

var assert = require('assert');

describe ('config', function() {
    describe('verifyKey', function() {
        it('exception if no key in config', function() {
            assert.throws(r._private.verifyKey([], "key"), Error);
        });
    });
});

describe('Array', function() {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    });
  });
});
