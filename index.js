/**!
 * TinyModel
 * @author romantaraban <rom.taraban@gmail.com>
 * @license MIT
 *
 * Model's event system is based on this Publish/Subscribe implementataion https://github.com/romantaraban/tiny-model
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['./node_modules/pubsub/index'], factory);
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require('pubsub'));
  } else {
    // Browser globals (root is window)
    root.TinyModel = factory(root.PubSub);
  }
}(this, function(PubSub) {
  "use strict";

  /**
   * Returns nested properties of an object. Throws an error when trying to access property of undefined object
   * @param {bool} obj, {string} ptop
   */
  var getDescentProp = function(obj, prop) {
    var path = prop.split('.');
    while (path.length) {
      obj = obj[path.shift()];
    }
    return obj;
  }

  var TinyModel = function(data) {
    this.state = data || {};
  };

  TinyModel.prototype = Object.create(PubSub.prototype);

  TinyModel.prototype.set = function() {
    if (typeof(arguments[0]) === 'string' && arguments.length > 1) {
      if (/\./.test(arguments[0])) {
        // split path into property names
        var path = arguments[0].split('.');
        // new property name
        var newPropName = path[path.length - 1];
        // new value to assing
        var newValue = arguments[1];
        // get parrent object of descent preperty or exit if it doesn't exist
        try {
          var parentProp = getDescentProp(this.state, arguments[0].replace(/\.(?:.(?!\.))+$/gim, ''));
        } catch (error) {
          throw error;
        }
        // check most descent parent property for type
        if (typeof(parentProp) === 'object') {
          // assing value to property
          if (parentProp[newPropName] === newValue) {
            return;
          }
          parentProp[newPropName] = newValue;
          // bubble event from descent property to top level
          for (var l = path.length, curPropPath; l > 0; l--) {
            curPropPath = path.slice(0, l).join('.');
            this.trigger('change:' + curPropPath, curPropPath, getDescentProp(this.state, curPropPath));
          }
        } else {
          // if not an object - then we can't set child properties to it, throw an error
          throw new Error(curPropPath + 'is not an object');
        }
      } else if (this.state[arguments[0]] !== arguments[1]) {
        this.state[arguments[0]] = arguments[1];
        this.trigger('change:' + arguments[0], arguments[0], arguments[1]);
      }
    } else if (typeof(arguments[0]) === 'object') {
      var data = arguments[0];
      for (var prop in data) {
        if (data.hasOwnProperty(prop)) {
          if (this.state[prop] !== data[prop]) {
            this.state[prop] = data[prop];
            this.trigger('change:' + prop, prop, data[prop]);
          }
        }
      }
    }
  };

  TinyModel.prototype.get = function(prop) {
    if (arguments.length > 1) {
      return Array.prototype.reduce.call(arguments, function(cache, el) {
        if (/\./.test(el)) {
          // get descent property
          try {
            cache[el.replace(/^.*(?:\.)/, '')] = getDescentProp(this.state, el);
          } catch (error) {
            throw new Error("Can\'t access property of undefined object," + error);
          }
        } else {
          cache[el] = this.state[el];
        }
        return cache;
      }.bind(this), {});
    } else {
      if (/\./.test(prop)) {
        // get descent property
        try {
          return getDescentProp(this.state, prop);
        } catch (error) {
          throw new Error("Can\'t access property of undefined object," + error);
        }
      } else {
        return this.state[prop];
      }
    }
  };

  TinyModel.prototype.remove = function(prop) {
    if (this.state[prop]) {
      var value = this.state[prop];
      delete this.state[prop];
      this.trigger('remove:' + prop, prop, value);
    }
  };

  TinyModel.prototype.reset = function() {
    for (var prop in this.state) {
      this.remove(prop);
    }
  };

  return TinyModel;

}));
