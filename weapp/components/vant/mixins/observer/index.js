"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.observe = observe;

var _behavior = require('behavior.js');

function observe(vantOptions, options) {
  var watch = vantOptions.watch;
  options.behaviors.push(_behavior.behavior);

  if (watch) {
    var props = options.properties || {};
    Object.keys(watch).forEach(function (key) {
      if (key in props) {
        var prop = props[key];

        if (prop === null || !('type' in prop)) {
          prop = {
            type: prop
          };
        }

        prop.observer = watch[key];
        props[key] = prop;
      }
    });
    options.properties = props;
  }
}