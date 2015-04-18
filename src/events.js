'use strict';

module.exports = {
    /*
        Methods used to listen to a given event
     */
    on: [
        // EventEmitter, jQuery & stuff (backbone, ember...)
        'on',

        // Angular & Vue
        '$on',

        // Mediator & shortcut
        'sub',
        'subscribe',

        // Google Maps
        'addListener',

        // DOM
        'addEventListener'
    ],

    /*
        Methods used to listen once to a given element
     */
    once: [
        // EventEmitter, jQuery & stuff
        'once',
        'one',

        // Angular & Vue
        '$once',

        // Mediator & shortcut
        'subOnce',
        'subscribeOnce',

        // Google Maps
        'addListenerOnce'
    ],

    /*
        Methods used to stop listening to a given event
     */
    off: [
        // EventEmitter, jQuery & stuff
        'off',

        // Angular & Vue
        '$off',

        // Mediator & shortcut
        'unsub',
        'unsubscribe',

        // Google Maps
        'removeListener',
        'clearListeners',

        // DOM
        'removeEventListener'
    ],

    /*
        Special methods used to remove all events from a given emitter
     */
    offAll: [
        // NodeJS EventEmitter
        'removeAll',

        // Google Maps
        'removeAllListeners'
    ]
};