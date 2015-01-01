hear
=====

Listen to any event emitter with a single API.

`.on`, `.addEventListener`, .`subscribe`, ... Why are there so many method names ?

hear is an "universal binder" that allows you to use one method name with the different event emitters, whether it is a DOM node, Node EventEmitter, mediator...
You can also pass a context and hear will handle this for you (no `bind` leak).

## Supported emitter types
- DOM nodes
- jQuery events
- Angular & Vue internal emitters
- Google Maps events
- Basically all objects with `on`/`off` methods. See [events.js](src/events.js) for API support list.
 
## Installation & usage
`npm i --save hearjs`

```js
var hear = require('hearjs');

var emitter = new EventEmitter();
var mediator = new Mediator();

function MyType() {
  hear($node, 'click', onEvent, this); // document.querySelector('.node');
  hear(emitter, 'onClick', onEvent, this); // EventEmitter
  hear(mediator, 'onClick', onEvent, this); // Mediator
}

MyType.prototype.onEvent = function() {
  // ...
};
```

## API

- `hear.on(emitter, eventName, fn, context)`
listen `eventName` on the `emitter`.

- `hear.once(emitter, eventName, fn, context)`
like `.on` but is unbound after first call.

- `hear.off(emitter, eventName, fn, context)`
Unbind an event listener.
If supported by the passed `emitter`:
  - if no `fn` is passed, all the `eventName` listeners will be unbound
  - if no `eventName` is passed, the `emitter` will be totally unbound

## Contributing
Checkout from `dev`, merge back against `dev`.
Add relevant test cases.
4 spaces, semicolon.