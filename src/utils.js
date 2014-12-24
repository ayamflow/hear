'use strict';

var slice = Array.prototype.slice;

module.exports = {
    /*
        Fast bind
     */
    bind: function(func, context) {
        var args = slice.call(arguments, 2);
        return function() {
            return func.apply(context, args);
        };
    }
};
