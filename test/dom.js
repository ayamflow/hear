'use strict';

var hear = require('../src/index.js');
var test = require('tape');

// Return a new div
function insertElement() {
    var element = document.createElement('div');
    document.body.appendChild(element);
    return element;
}

// Dispatch a native event on a given DOM element
function triggerEvent(el, eventName) {
    var evt = document.createEvent('HTMLEvents');
    evt.initEvent(eventName, true, false);
    el.dispatchEvent(evt);
}

test('hear.on with DOM node', function(assert) {
    assert.plan(1);

    function callback() {
        assert.pass('event listener should be called');
    }

    var el = insertElement();
    hear.on(el, 'click', callback);
    triggerEvent(el, 'click');
});

test('hear.off with DOM node', function(assert) {
    assert.plan(1);

    function callback() {
        assert.fail('event listener should NOT be called');
    }

    var el = insertElement();
    hear.on(el, 'click', callback);
    hear.off(el, 'click', callback);
    triggerEvent(el, 'click');

    process.nextTick(function() {
        assert.pass('event listener has not been called');
    });
});

test('hear.once with DOM node', function(assert) {
    assert.plan(2);

    var called = false;

    function callback() {
        if(!called) {
            assert.pass('event listener should be called');
            called = true;
            return;
        }

        assert.fail('event listener should NOT be called');
    }

    var el = insertElement();
    hear.once(el, 'click', callback);
    triggerEvent(el, 'click');
    triggerEvent(el, 'click');

    process.nextTick(function() {
        assert.pass('event listener has been called once');
    });
});

test('hear.on with DOM node and context', function(assert) {
    assert.plan(2);

    var obj = {
        prop: 'foo',
        callback: function() {
            assert.deepEqual(this.prop, 'foo', 'Context should be properly bound');
        },
        nopeCallback: function() {
            assert.notDeepEqual(this.prop, 'foo', 'Context should not be bound');
        }
    };

    var el = insertElement();
    hear.on(el, 'click', obj.callback, obj);
    hear.on(el, 'click', obj.nopeCallback);
    triggerEvent(el, 'click');
});

test('hear.once with DOM node and context', function(assert) {
    assert.plan(3);

    var obj = {
        prop: 'foo',
        called: false,
        callback: function() {
            if(!this.called) {
                assert.pass('Callback called once');
                assert.deepEqual(this.prop, 'foo', 'Context should be properly bound');
                this.called = true;
                return;
            }
            assert.fail('Callback has been called twice');
        }
    };

    var el = insertElement();
    hear.on(el, 'click', obj.callback, obj);
    triggerEvent(el, 'click');
    process.nextTick(function() {
        assert.pass('event listener has been called once');
    });
});
