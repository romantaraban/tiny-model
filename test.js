var Model = require('./index.js');
var assert = require('chai').assert;

describe('Model', function() {
  var model = new Model();

  describe('set()', function() {
    it('should save value in state', function() {
      model.set({test: 1});
      assert.equal(1, model.state.test);
    });

    it('should be able to save multiple values in state', function() {
      model.set({test2: 2, test3: 3});
      assert.equal(2, model.state.test2);
      assert.equal(3, model.state.test3);
    });

    it('should be able to save properties via dot notation', function() {
      var marker = marker2 = marker3 = 0;
      model.on('change:testobj', function() {marker++});
      model.on('change:testobj.f', function() {marker2++});
      model.on('change:testobj.f.z', function() {marker3++});

      model.set({testobj: {a:2, f:{}}});
      model.set('testobj.ttt', 3);
      model.set('testobj.f.z', 1);

      // test asigment
      assert.equal(2, model.state.testobj.a);
      assert.equal(3, model.state.testobj.ttt);
      assert.equal(1, model.state.testobj.f.z);

      // test event bubbling
      assert.equal(3, marker);
      assert.equal(1, marker2);
      assert.equal(1, marker3);
    });

    it('should throw an error on accessing property of undefined onject', function() {
      try {
        model.set('asdf.asdf.asdfasdf2344323.sd');
      } catch (error) {
        assert.equal(true, error instanceof Error);
      }
    });

    it('should do nothing when assinging same value', function() {
      var marker = 0;
      var nn = {nothing3: 2, nothing2: {test:1}}
      model.set('nothing', 1);
      model.set(nn);
      model.set('nothing2.test', 1);
      
      model.on('change:nothing', function() {marker++});
      model.on('change:nothing2.test', function() {marker++});
      model.on('change:nothing2', function() {marker++});
      model.on('change:nothing3', function() {marker++});

      model.set('nothing', 1);
      model.set(nn);
      model.set('nothing2.test', 1);
      assert.equal(0, marker);
    });

  });

  describe('get()', function() {
    it('should get value from state', function() {
      assert.equal(1, model.get('test'));
    });

    it('can return multiple parameters if multiple arguments passed', function() {
      var data = model.get('test', 'test2', 'test3');
      assert.equal(1, data.test);
      assert.equal(2, data.test2);
      assert.equal(3, data.test3);
    });

    it('can return parameters by dot notation', function() {
      var data = model.get('testobj.f.z');
      assert.equal(1, data);
    });

    it('can return multiple parameters by dot notation', function() {
      var data = model.get('testobj.f.z', 'testobj.ttt');
      assert.equal(1, data.z);
      assert.equal(3, data.ttt);
    });

  });

  it('remove() should remove value from state', function() {
    model.remove('test');
    assert.equal(undefined, model.get('test'));
  });

  it('reset() should remove all value from state', function() {
    model.reset();
    assert.equal(undefined, model.get('test'));
    assert.equal(undefined, model.get('test2'));
    assert.equal(undefined, model.get('test3'));
  });

});
