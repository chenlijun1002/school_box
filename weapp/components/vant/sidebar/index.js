"use strict";

var _component = require('../common/component.js');

(0, _component.VantComponent)({
  relation: {
    name: 'sidebar-item',
    type: 'descendant',
    linked: function linked(target) {
      this.children.push(target);
      this.setActive(this.data.activeKey);
    },
    unlinked: function unlinked(target) {
      this.items = this.children.filter(function (item) {
        return item !== target;
      });
      this.setActive(this.data.activeKey);
    }
  },
  props: {
    activeKey: {
      type: Number,
      value: 0,
      observer: 'setActive'
    }
  },
  beforeCreate: function beforeCreate() {
    this.children = [];
    this.currentActive = -1;
  },
  methods: {
    setActive: function setActive(activeKey) {
      var children = this.children,
          currentActive = this.currentActive;

      if (!children.length) {
        return Promise.resolve();
      }

      this.currentActive = activeKey;
      var stack = [];

      if (currentActive !== activeKey && children[currentActive]) {
        stack.push(children[currentActive].setActive(false));
      }

      if (children[activeKey]) {
        stack.push(children[activeKey].setActive(true));
      }

      return Promise.all(stack);
    }
  }
});