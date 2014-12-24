'use strict';

var hear = require('../src/index.js');
var Mediator = require('mediator-js').Mediator;
var test = require('tape');

test('hear.on with Mediator', function(assert) {
    assert.plan(1);

    function callback() {
        assert.pass('event listener should be called');
    }

    var mediator = new Mediator();
    hear.on(mediator, 'someEvent', callback);
    mediator.emit('someEvent');
});

test('hear.off with Mediator', function(assert) {
    assert.plan(1);

    function callback() {
        assert.fail('event listener should NOT be called');
    }

    var mediator = new Mediator();
    hear.on(mediator, 'someEvent', callback);
    hear.off(mediator, 'someEvent', callback);
    mediator.emit('someEvent');

    process.nextTick(function() {
        assert.pass('event listener has not been called');
    });
});

test('hear.once with Mediator', function(assert) {
    assert.plan(3);

    var called = false;

    function callback() {
        if(!called) {
            assert.pass('event listener should be called');
            called = true;
            return;
        }

        assert.fail('event listener should NOT be called');
    }

    var mediator = new Mediator();
    hear.once(mediator, 'someEvent', callback);
    mediator.emit('someEvent');
    mediator.emit('someEvent');
    assert.equal(mediator._channels._channels.someEvent._subscribers.length, 0, 'Mediator\'s callbacks should be null');

    process.nextTick(function() {
        assert.pass('event listener has been called once');
    });
});

test('hear.on with Mediator and arguments', function(assert) {
    assert.plan(2);

    function callback(a, b) {
        assert.equal(a, 1);
        assert.equal(b, 2);
    }

    var mediator = new Mediator();
    hear.on(mediator, 'someEvent', callback);
    mediator.emit('someEvent', 1, 2);
});

test('hear.once with Mediator and arguments', function(assert) {
    assert.plan(5);

    var called = false;

    function callback(a, b) {
        if(!called) {
            assert.pass('event listener should be called once');
            assert.equal(a, 1);
            assert.equal(b, 2);
            called = true;
            return;
        }

        assert.fail('event listener should NOT be called');
    }

    var mediator = new Mediator();
    hear.once(mediator, 'someEvent', callback);
    mediator.emit('someEvent', 1, 2);
    mediator.emit('someEvent', 1, 2);
    assert.equal(mediator._channels._channels.someEvent._subscribers.length, 0, 'Mediator\'s callbacks should be null');
    process.nextTick(function() {
        assert.pass('event listener has been called once');
    });
});

test('hear.on with Mediator and context', function(assert) {
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

    var mediator = new Mediator();
    hear.on(mediator, 'someEvent', obj.callback, obj);
    hear.on(mediator, 'nopeEvent', obj.nopeCallback);
    mediator.emit('someEvent');
    mediator.emit('nopeEvent');
});

test('hear.once with Mediator and context', function(assert) {
    assert.plan(4);

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

    var mediator = new Mediator();
    hear.once(mediator, 'someEvent', obj.callback, obj);
    mediator.emit('someEvent');
    mediator.emit('someEvent');
    assert.equal(mediator._channels._channels.someEvent._subscribers.length, 0, 'Mediator\'s callbacks should be null');
    process.nextTick(function() {
        assert.pass('event listener has been called once');
    });
});
