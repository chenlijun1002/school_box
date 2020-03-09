"use strict";

var _component = require('../common/component.js');

(0, _component.VantComponent)({
  classes: ['active-class', 'disabled-class'],
  relation: {
    type: 'ancestor',
    name: 'sidebar',
    linked: function linked(target) {
      this.parent = target;
    }
  },
  props: {
    dot: Boolean,
    info: null,
    title: String,
    disabled: Boolean
  },
  methods: {
    onClick: function onClick() {
      var _this = this;

      var parent = this.parent;

      if (!parent || this.data.disabled) {
        return;
      }

      var index = parent.children.indexOf(this);
      parent.setActive(index).then(function () {
        _this.$emit('click', index);

        parent.$emit('change', index);
      });
    },
    setActive: function setActive(selected) {
      return this.setData({
        selected: selected
      });
    }
  }
});