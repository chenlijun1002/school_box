"use strict";

var _component = require('../common/component.js');

var _utils = require('../common/utils.js');

(0, _component.VantComponent)({
  props: {
    dot: Boolean,
    info: null,
    size: {
      type: null,
      observer: 'setSizeWithUnit'
    },
    color: String,
    customStyle: String,
    classPrefix: {
      type: String,
      value: 'van-icon'
    },
    name: {
      type: String,
      observer: function observer(val) {
        this.setData({
          isImageName: val.indexOf('/') !== -1
        });
      }
    }
  },
  data: {
    sizeWithUnit: null
  },
  methods: {
    onClick: function onClick() {
      this.$emit('click');
    },
    setSizeWithUnit: function setSizeWithUnit(size) {
      this.setData({
        sizeWithUnit: (0, _utils.addUnit)(size)
      });
    }
  }
});