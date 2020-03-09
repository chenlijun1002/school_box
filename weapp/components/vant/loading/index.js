"use strict";

var _component = require('../common/component.js');

var _utils = require('../common/utils.js');

(0, _component.VantComponent)({
  props: {
    color: String,
    vertical: Boolean,
    type: {
      type: String,
      value: 'circular'
    },
    size: {
      type: String,
      observer: 'setSizeWithUnit'
    },
    textSize: {
      type: String,
      observer: 'setTextSizeWithUnit'
    }
  },
  methods: {
    setSizeWithUnit: function setSizeWithUnit(size) {
      this.setData({
        sizeWithUnit: (0, _utils.addUnit)(size)
      });
    },
    setTextSizeWithUnit: function setTextSizeWithUnit(size) {
      this.set({
        textSizeWithUnit: (0, _utils.addUnit)(size)
      });
    }
  }
});