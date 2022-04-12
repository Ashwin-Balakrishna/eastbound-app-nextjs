"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactBootstrap = require("react-bootstrap");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _v = _interopRequireDefault(require("uuid/v4"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var ellipsisDefaultStyle = {
  overflow: 'hidden',
  overflowWrap: 'break-word',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  wordBreak: 'break-all'
};

var EllipisWithTooltip =
/*#__PURE__*/
function (_React$Component) {
  _inherits(EllipisWithTooltip, _React$Component);

  function EllipisWithTooltip(props) {
    var _this;

    _classCallCheck(this, EllipisWithTooltip);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(EllipisWithTooltip).call(this, props));
    _this.state = {
      hasOverflowingChildren: false,
      text: undefined,
      prevPropsChildren: props.children
    };
    _this.updateOverflow = _this.updateOverflow.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(EllipisWithTooltip, [{
    key: "updateOverflow",
    value: function updateOverflow(e) {
      var el = e.target;
      var _this$state = this.state,
          hasOverflowingChildren = _this$state.hasOverflowingChildren,
          text = _this$state.text;

      if (!hasOverflowingChildren && el.scrollWidth > el.clientWidth) {
        this.setState({
          hasOverflowingChildren: true
        });

        if (el.textContent !== text) {
          this.setState({
            text: el.textContent
          });
        }
      } else {
        this.setState({
          hasOverflowingChildren: false
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$state2 = this.state,
          hasOverflowingChildren = _this$state2.hasOverflowingChildren,
          text = _this$state2.text;
      var _this$props = this.props,
          _this$props$placement = _this$props.placement,
          placement = _this$props$placement === void 0 ? 'top' : _this$props$placement,
          _this$props$style = _this$props.style,
          style = _this$props$style === void 0 ? {} : _this$props$style,
          delayShow = _this$props.delayShow,
          delayHide = _this$props.delayHide,
          children = _this$props.children;

      var tooltip = _react["default"].createElement(_reactBootstrap.Tooltip, {
        id: "tooltip-".concat((0, _v["default"])())
      }, text);

      var ellipsisStyle = _objectSpread({}, ellipsisDefaultStyle, {}, style);

      return hasOverflowingChildren ? _react["default"].createElement(_reactBootstrap.OverlayTrigger, {
        placement: placement,
        overlay: tooltip,
        delayShow: delayShow,
        delayHide: delayHide
      }, _react["default"].createElement("div", {
        style: ellipsisStyle
      }, children)) : _react["default"].createElement("div", {
        style: ellipsisStyle,
        onMouseEnter: this.updateOverflow
      }, children);
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props, state) {
      if (props.children === state.prevPropsChildren) return null;
      return {
        hasOverflowingChildren: false,
        prevPropsChildren: props.children
      };
    }
  }]);

  return EllipisWithTooltip;
}(_react["default"].Component);

EllipisWithTooltip.propTypes = {
  placement: _propTypes["default"].string,
  children: _propTypes["default"].node.isRequired,
  style: _propTypes["default"].object,
  delayShow: _propTypes["default"].number,
  delayHide: _propTypes["default"].number
};
EllipisWithTooltip.defaultProps = {
  placement: undefined,
  style: undefined,
  delayHide: undefined,
  delayShow: undefined
};
var _default = EllipisWithTooltip;
exports["default"] = _default;