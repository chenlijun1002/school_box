"use strict";

var _component = require('../common/component.js');

(0, _component.VantComponent)({
  classes: ['bar-class', 'price-class', 'button-class'],
  props: {
    tip: {
      type: null,
      observer: 'updateTip'
    },
    tipIcon: String,
    type: Number,
    price: {
      type: null,
      observer: 'updatePrice'
    },
    label: String,
    loading: Boolean,
    disabled: Boolean,
    buttonText: String,
    currency: {
      type: String,
      value: '¥'
    },
    buttonType: {
      type: String,
      value: 'danger'
    },
    decimalLength: {
      type: Number,
      value: 2,
      observer: 'updatePrice'
    },
    suffixLabel: String,
    safeAreaInsetBottom: {
      type: Boolean,
      value: true
    }
  },
  methods: {
    updatePrice: function updatePrice() {
      var _this$data = this.data,
          price = _this$data.price,
          decimalLength = _this$data.decimalLength;
      this.setData({
        hasPrice: typeof price === 'number',
        priceStr: (price / 100).toFixed(decimalLength)
      });
    },
    updateTip: function updateTip() {
      this.setData({
        hasTip: typeof this.data.tip === 'string'
      });
    },
    onSubmit: function onSubmit(event) {
      this.$emit('submit', event.detail);
    }
  }
});