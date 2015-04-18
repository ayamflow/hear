'use strict';

var slice = Array.prototype.slice;

module.exports = {
    /*
        Fast bind
     */
    bind: function(func, context) {
        return function() {
            return func.apply(context, arguments);
        };
    }
};
