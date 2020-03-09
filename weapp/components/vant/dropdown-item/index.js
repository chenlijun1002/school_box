"use strict";

var _component = require('../common/component.js');

(0, _component.VantComponent)({
  field: true,
  relation: {
    name: 'dropdown-menu',
    type: 'ancestor',
    linked: function linked(target) {
      this.parent = target;
    },
    unlinked: function unlinked() {
      this.parent = null;
    }
  },
  props: {
    value: null,
    title: String,
    disabled: Boolean,
    titleClass: String,
    options: {
      type: Array,
      value: []
    }
  },
  data: {
    transition: true,
    showPopup: false,
    showWrapper: false,
    displayTitle: ''
  },
  created: function created() {
    this.setData({
      displayTitle: this.computedDisplayTitle(this.data.value)
    });
  },
  methods: {
    computedDisplayTitle: function computedDisplayTitle(curValue) {
      var _this$data = this.data,
          title = _this$data.title,
          options = _this$data.options;

      if (title) {
        return title;
      }

      var match = options.filter(function (option) {
        return option.value === curValue;
      });
      var displayTitle = match.length ? match[0].text : '';
      return displayTitle;
    },
    onClickOverlay: function onClickOverlay() {
      this.toggle();
      this.$emit('close');
    },
    onOptionTap: function onOptionTap(event) {
      var _this = this;

      var _this$data2 = this.data,
          value = _this$data2.value,
          displayTitle = _this$data2.displayTitle;
      var option = event.currentTarget.dataset.option;
      var optionValue = option.value;

      if (optionValue !== value) {
        value = optionValue;
        displayTitle = this.computedDisplayTitle(optionValue);
        this.$emit('change', optionValue);
      }

      this.setData({
        showPopup: false,
        value: value,
        displayTitle: displayTitle
      });
      var time = this.data.duration || 0;
      setTimeout(function () {
        _this.setData({
          showWrapper: false
        });
      }, time); // parent 中的 itemListData 是 children 上的数据的集合
      // 数据的更新由 children 各自维护，但是模板的更新需要额外触发 parent 的 setData

      this.parent.setData({
        itemListData: this.parent.data.itemListData
      });
    },
    toggle: function toggle() {
      var childIndex = this.data.childIndex;
      this.parent.toggleItem(childIndex);
    }
  }
});