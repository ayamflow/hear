'use strict';

var hear = require('../src/index.js');
var EventEmitter = require('component-emitter');
var test = require('tape');

test('hear.on with EventEmitter', function(assert) {
    assert.plan(1);

    function callback() {
        assert.pass('event listener should be called');
    }

    var emitter = new EventEmitter();
    hear.on(emitter, 'someEvent', callback);
    emitter.emit('someEvent');
});

test('hear.off with EventEmitter', function(assert) {
    assert.plan(1);

    function callback() {
        assert.fail('event listener should NOT be called');
    }

    var emitter = new EventEmitter();
    hear.on(emitter, 'someEvent', callback);
    hear.off(emitter, 'someEvent', callback);
    emitter.emit('someEvent');

    process.nextTick(function() {
        assert.pass('event listener has not been called');
    });
});

test('hear.once with EventEmitter', function(assert) {
    assert.plan(3);

    var called = false;

    function callback() {
        if(!called) {
            assert.pass('event listener should be called once');
            called = true;
            return;
        }

        assert.fail('event listener should NOT be called');
    }

    var emitter = new EventEmitter();
    hear.once(emitter, 'someEvent', callback);
    emitter.emit('someEvent');
    emitter.emit('someEvent');
    assert.equal(emitter._callbacks.someEvent.length, 0, 'Emitter\'s callbacks should be null');

    process.nextTick(function() {
        assert.pass('event listener has been called once');
    });
});

test('hear.on with EventEmitter and arguments', function(assert) {
    assert.plan(2);

    function callback(a, b) {
        assert.equal(a, 1);
        assert.equal(b, 2);
    }

    var emitter = new EventEmitter();
    hear.on(emitter, 'someEvent', callback);
    emitter.emit('someEvent', 1, 2);
});

test('hear.once with EventEmitter and arguments', function(assert) {
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

    var emitter = new EventEmitter();
    hear.once(emitter, 'someEvent', callback);
    emitter.emit('someEvent', 1, 2);
    emitter.emit('someEvent', 1, 2);
    assert.equal(emitter._callbacks.someEvent.length, 0, 'Emitter\'s callbacks should be null');
    process.nextTick(function() {
        assert.pass('event listener has been called once');
    });
});

test('hear.on with EventEmitter and context', function(assert) {
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

    var emitter = new EventEmitter();
    hear.on(emitter, 'someEvent', obj.callback, obj);
    hear.on(emitter, 'nopeEvent', obj.nopeCallback);
    emitter.emit('someEvent');
    emitter.emit('nopeEvent');
});

test('hear.once with EventEmitter and context', function(assert) {
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

    var emitter = new EventEmitter();
    hear.once(emitter, 'someEvent', obj.callback, obj);
    emitter.emit('someEvent');
    emitter.emit('someEvent');
    assert.equal(emitter._callbacks.someEvent.length, 0, 'Emitter\'s callbacks should be null');
    process.nextTick(function() {
        assert.pass('event listener has been called once');
    });
});
