"use strict";

var _component = require('../common/component.js');

var _utils = require('../common/utils.js');

var ARRAY = [];
(0, _component.VantComponent)({
  field: true,
  relation: {
    name: 'dropdown-item',
    type: 'descendant',
    linked: function linked(target) {
      this.children = this.children || []; // 透传 props 给 dropdown-item

      var _this$data = this.data,
          overlay = _this$data.overlay,
          duration = _this$data.duration,
          activeColor = _this$data.activeColor,
          closeOnClickOverlay = _this$data.closeOnClickOverlay,
          direction = _this$data.direction;
      this.updateChildData(target, {
        overlay: overlay,
        duration: duration,
        activeColor: activeColor,
        closeOnClickOverlay: closeOnClickOverlay,
        direction: direction,
        childIndex: this.children.length
      });
      this.children.push(target); // 收集 dorpdown-item 的 data 挂在 data 上

      target && this.setData({
        itemListData: this.data.itemListData.concat([target.data])
      });
    },
    unlinked: function unlinked(target) {
      this.children = this.children.filter(function (child) {
        return child !== target;
      });
    }
  },
  props: {
    activeColor: String,
    overlay: {
      type: Boolean,
      value: true
    },
    zIndex: {
      type: Number,
      value: 10
    },
    duration: {
      type: Number,
      value: 200
    },
    direction: {
      type: String,
      value: 'down'
    },
    closeOnClickOverlay: {
      type: Boolean,
      value: true
    },
    closeOnClickOutside: {
      type: Boolean,
      value: true
    }
  },
  data: {
    itemListData: []
  },
  created: function created() {
    ARRAY.push(this);
  },
  destroyed: function destroyed() {
    var _this = this;

    ARRAY = ARRAY.filter(function (item) {
      return item !== _this;
    });
  },
  methods: {
    updateChildData: function updateChildData(childItem, newData) {
      var needRefreshList = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      childItem.setData(newData);

      if (needRefreshList) {
        // dropdown-item data 更新，涉及到 title 的展示，触发模板更新
        this.setData({
          itemListData: this.data.itemListData
        });
      }
    },
    toggleItem: function toggleItem(active) {
      var _this2 = this;

      this.children.forEach(function (item, index) {
        var showPopup = item.data.showPopup;

        if (index === active) {
          _this2.toggleChildItem(item);
        } else if (showPopup) {
          _this2.toggleChildItem(item, false, {
            immediate: true
          });
        }
      });
    },
    toggleChildItem: function toggleChildItem(childItem, show) {
      var _this3 = this;

      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var _childItem$data = childItem.data,
          showPopup = _childItem$data.showPopup,
          duration = _childItem$data.duration;
      if (show === undefined) show = !showPopup;

      if (show === showPopup) {
        return;
      }

      var newChildData = {
        transition: !options.immediate,
        showPopup: show
      };

      if (!show) {
        var time = options.immediate ? 0 : duration;
        this.updateChildData(childItem, Object.assign({}, newChildData), true);
        setTimeout(function () {
          _this3.updateChildData(childItem, {
            showWrapper: false
          }, true);
        }, time);
        return;
      }

      this.getChildWrapperStyle().then(function () {
        var wrapperStyle = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

        _this3.updateChildData(childItem, Object.assign(Object.assign({}, newChildData), {
          wrapperStyle: wrapperStyle,
          showWrapper: true
        }), true);
      });
    },
    close: function close() {
      var _this4 = this;

      this.children.forEach(function (item) {
        _this4.toggleChildItem(item, false, {
          immediate: true
        });
      });
    },
    getChildWrapperStyle: function getChildWrapperStyle() {
      var _wx$getSystemInfoSync = wx.getSystemInfoSync(),
          windowHeight = _wx$getSystemInfoSync.windowHeight;

      var _this$data2 = this.data,
          zIndex = _this$data2.zIndex,
          direction = _this$data2.direction;
      var offset = 0;
      return this.getRect('.van-dropdown-menu').then(function (rect) {
        var _rect$top = rect.top,
            top = _rect$top === void 0 ? 0 : _rect$top,
            _rect$bottom = rect.bottom,
            bottom = _rect$bottom === void 0 ? 0 : _rect$bottom;

        if (direction === 'down') {
          offset = bottom;
        } else {
          offset = windowHeight - top;
        }

        var wrapperStyle = "z-index: ".concat(zIndex, ";");

        if (direction === 'down') {
          wrapperStyle += "top: ".concat((0, _utils.addUnit)(offset), ";");
        } else {
          wrapperStyle += "bottom: ".concat((0, _utils.addUnit)(offset), ";");
        }

        return Promise.resolve(wrapperStyle);
      });
    },
    onTitleTap: function onTitleTap(event) {
      var _this5 = this;

      // item ---> dropdown-item
      var _event$currentTarget$ = event.currentTarget.dataset,
          item = _event$currentTarget$.item,
          index = _event$currentTarget$.index;

      if (!item.disabled) {
        // menuItem ---> dropdown-menu
        ARRAY.forEach(function (menuItem) {
          if (menuItem && menuItem.data.closeOnClickOutside && menuItem !== _this5) {
            menuItem.close();
          }
        });
        this.toggleItem(index);
      }
    }
  }
});