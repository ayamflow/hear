'use strict';

var _ = require('./utils');
var methods = require('./events');

var bounds = {};

module.exports = {
    on: function(emitter, name, fn, context) {
        var onMethod = getEmitterMethod(emitter, 'on');
        var callback = fn;
        if(context) {
            // callback = function() {
            //     fn.call(context, arguments);
            // };
            callback = setBound(name, fn, context);
        }

        // UNTESTED - Google maps special case
        /*if(emitter.gm_accessors_) {
            window.google.maps.events.addListener(emitter, name, callback);
            return;
        }*/

        emitter[onMethod].call(emitter, name, callback);
    },

    off: function(emitter, name, fn, context) {
        var offMethod = getEmitterMethod(emitter, 'off');

        if(!name || !fn) {
            offMethod = getEmitterMethod(emitter, 'offAll') || offMethod;
        }

        var callbacks = [fn];
        if(context) {
            callbacks = getBound(name, fn, context);
        }
        if (!callbacks) return;

        // UNTESTED - Google maps special case
        /*if(emitter.gm_accessors_) {
            callbacks.forEach(function(cb) {
                window.google.maps.events.clearListeners(emitter, name, cb);
            });
            return;
        }*/

        callbacks.forEach(function(cb) {
            emitter[offMethod].call(emitter, name, cb);
        });
    },

    once: function(emitter, name, fn, context) {
        // Proxy to the emitter's `once` method if available
        var onceMethod = getEmitterMethod(emitter, 'once');
        if(onceMethod) {
            var callback = fn;
            if(context) {
                callback = setBound(name, fn, context);
            }

            // UNTESTED - Google maps special case
            /*if(emitter.gm_accessors_) {
                window.google.maps.events.addListenerOnce(emitter, name, callback);
                return;
            }*/

            emitter[onceMethod].call(emitter, name, callback);
            return;
        }

        // Else use internal `once`
        var on = _.bind(function() {
            this.off(emitter, name, on, context);
            fn.apply(context, arguments);
        }, this);

        this.on(emitter, name, on, context);
    }
};

/*
    Find the pub/sub method on a given emitter
 */
function getEmitterMethod(emitter, type) {
    for(var prop in emitter) {
      if(methods[type].indexOf(prop) > -1) return prop;
    }
}

/*
    If a context is passed to the `on` method,
    we need to store a reference to the bound function
    so it can be properly unbound later.
 */
function setBound(name, fn, context) {
    var boundFn = _.bind(fn, context);
    bounds[name] = bounds[name] || [];
    bounds[name].push({
        fn: fn,
        context: context,
        bound: boundFn
    });

    return boundFn;
}

/*
    Retrieve all bound functions matching the
    event name & fn/context references
 */
function getBound(name, fn, context) {
    var namedEvents = bounds[name];
    if (!namedEvents) return;

    var events = [];
    for(var i = namedEvents.length - 1; i >= 0; i--) {
        var bound = namedEvents[i];
        if(bound.fn === fn && bound.context === context) {
            events.concat(namedEvents.splice(i, 1));
        }
    }
    return events;
}
