"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.behavior = void 0;
var behavior = Behavior({
  methods: {
    set: function set(data, callback) {
      var _this = this;

      return new Promise(function (resolve) {
        _this.setData(data, function () {
          if (callback && typeof callback === 'function') {
            callback.call(_this);
          }

          resolve();
        });
      });
    }
  }
});
exports.behavior = behavior;