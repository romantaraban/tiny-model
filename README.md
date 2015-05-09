# tiny-model
[![Build Status](https://travis-ci.org/romantaraban/tiny-model.svg)](https://travis-ci.org/romantaraban/tiny-model)

Simple module with minimalistic API. Allows to listen and get notified when state was changed.

#Usage
```javascript
// create new instance of model
var test = new TinyModel({foo: 1, bar: 2});

// get value from model
var foo = test.get('foo');

// listen to changes in model
test.on('change:foo', function (eventName, propName, newValue) {
  console.log('Property ' + propName + 'was changed, new value: ' + newValue);
});

// set value in model
// this will change value of foo and trigger event 'change:foo'
test.set('foo', 3);

// remove property
// this also will trigger event 'remove:foo'
test.remove('foo');

```

