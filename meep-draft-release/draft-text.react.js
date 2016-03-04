'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _merge = require('./lib/merge.js');

var _merge2 = _interopRequireDefault(_merge);

var _draftText = require('./draft-text.style');

var _draftText2 = _interopRequireDefault(_draftText);

var _draftJs = require('draft-js');

var _block = require('./draft-type-core/block');

var _block2 = _interopRequireDefault(_block);

var _inline = require('./draft-type-core/inline');

var _custom = require('./draft-custom-core/custom');

require('./draft-vendor/draft-text.css');

require('./draft-vendor/draft-editor.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
// import Component from 'meepworks/component';
// import merge from 'meepworks/merge';


//type-core

//custom-core


var getBlockStyle = function getBlockStyle(block) {
  switch (block.getType()) {
    case 'align-left':
      return 'custon-align-left';
    case 'align-center':
      return 'custon-align-center';
    case 'align-right':
      return 'custon-align-right';
    default:
      return null;
  }
};

var findLinkEntities = function findLinkEntities(contentBlock, callback) {
  contentBlock.findEntityRanges(function (character) {
    var entityKey = character.getEntity();
    return entityKey !== null && _draftJs.Entity.get(entityKey).getType() === 'link';
  }, callback);
};

var DraftTextHandlers = {
  hasPlaceholder: function hasPlaceholder() {
    if (this.props.placeholder === undefined) {
      return this.defaultSetting.placeholder;
    } else {
      return this.props.placeholder;
    }
  }
};

var DraftText = function (_Component) {
  _inherits(DraftText, _Component);

  function DraftText() {
    var _Object$getPrototypeO;

    _classCallCheck(this, DraftText);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    //

    var _this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(DraftText)).call.apply(_Object$getPrototypeO, [this].concat(args)));

    _this._onHandlLink = function (e, action) {
      var editorState = _this.state.editorState;

      var selection = editorState.getSelection();
      var entityKey = undefined;
      var content = undefined;
      var oldUrl = undefined;
      switch (action) {
        case 'addLink':
          if (selection.isCollapsed()) {
            return;
          }
          var selectedBlockEntityNumber = editorState.getCurrentContent().getBlockForKey(editorState.getSelection().getStartKey()).getEntityAt(editorState.getSelection().getStartOffset());
          if (selectedBlockEntityNumber !== null) {
            oldUrl = _draftJs.Entity.get(selectedBlockEntityNumber).get('data').href;
          }
          var href = window.prompt('請輸入網址', oldUrl);
          content = editorState.getCurrentContent();
          if (href === null) return;
          entityKey = _draftJs.Entity.create('link', 'MUTABLE', { href: href });
          break;
        case 'removeLink':
          entityKey = null;
          content = editorState.getCurrentContent();
          break;
      }
      _this.setState({
        editorState: _draftJs.RichUtils.toggleLink(editorState, selection, entityKey)
      });
    };

    _this._setEditorState = function (editorState) {
      _this.onChange(editorState);
    };

    _this._toggleFontFamily = function (family) {
      var editorState = _this.state.editorState;

      var selection = editorState.getSelection();
      //最多只能一次有一個顏色
      var nextContentState = Object.keys(_custom.FONTFAMILY).reduce(function (contentState, family) {
        return _draftJs.Modifier.removeInlineStyle(contentState, selection, family);
      }, editorState.getCurrentContent());
      var nextEditorState = _draftJs.EditorState.push(editorState, nextContentState, 'change-inline-style');
      var currentStyle = editorState.getCurrentInlineStyle();
      if (selection.isCollapsed()) {
        nextEditorState = currentStyle.reduce(function (state, family) {
          return _draftJs.RichUtils.toggleInlineStyle(state, family);
        }, nextEditorState);
      }
      if (!currentStyle.has(family)) {
        nextEditorState = _draftJs.RichUtils.toggleInlineStyle(nextEditorState, family);
      }
      _this.onChange(nextEditorState);
    };

    _this._toggleFontSize = function (size) {
      var editorState = _this.state.editorState;

      var selection = editorState.getSelection();
      //最多只能一次有一個顏色
      var nextContentState = Object.keys(_custom.FONTSIZE).reduce(function (contentState, size) {
        return _draftJs.Modifier.removeInlineStyle(contentState, selection, size);
      }, editorState.getCurrentContent());
      var nextEditorState = _draftJs.EditorState.push(editorState, nextContentState, 'change-inline-style');
      var currentStyle = editorState.getCurrentInlineStyle();
      if (selection.isCollapsed()) {
        nextEditorState = currentStyle.reduce(function (state, size) {
          return _draftJs.RichUtils.toggleInlineStyle(state, size);
        }, nextEditorState);
      }
      if (!currentStyle.has(size)) {
        nextEditorState = _draftJs.RichUtils.toggleInlineStyle(nextEditorState, size);
      }
      _this.onChange(nextEditorState);
    };

    _this._toggleInlineStyle = function (inlineStyle) {
      _this.onChange(_draftJs.RichUtils.toggleInlineStyle(_this.state.editorState, inlineStyle));
    };

    _this._toggleBlockType = function (blockType) {
      _this.onChange(_draftJs.RichUtils.toggleBlockType(_this.state.editorState, blockType));
    };

    _this._toggleColor = function (color) {
      var editorState = _this.state.editorState;

      var selection = editorState.getSelection();
      //最多只能一次有一個顏色
      var nextContentState = Object.keys(_custom.COLORS).reduce(function (contentState, color) {
        return _draftJs.Modifier.removeInlineStyle(contentState, selection, color);
      }, editorState.getCurrentContent());
      var nextEditorState = _draftJs.EditorState.push(editorState, nextContentState, 'change-inline-style');
      var currentStyle = editorState.getCurrentInlineStyle();
      if (selection.isCollapsed()) {
        nextEditorState = currentStyle.reduce(function (state, color) {
          return _draftJs.RichUtils.toggleInlineStyle(state, color);
        }, nextEditorState);
      }
      if (!currentStyle.has(color)) {
        nextEditorState = _draftJs.RichUtils.toggleInlineStyle(nextEditorState, color);
      }
      _this.onChange(nextEditorState);
    };

    _this._toggleBackgroundColor = function (backgroundcolor) {
      var editorState = _this.state.editorState;

      var selection = editorState.getSelection();
      //最多只能一次有一個顏色
      var nextContentState = Object.keys(_custom.BACKGROUNDCOLORS).reduce(function (contentState, backgroundcolor) {
        return _draftJs.Modifier.removeInlineStyle(contentState, selection, backgroundcolor);
      }, editorState.getCurrentContent());
      var nextEditorState = _draftJs.EditorState.push(editorState, nextContentState, 'change-inline-style');
      var currentStyle = editorState.getCurrentInlineStyle();
      if (selection.isCollapsed()) {
        nextEditorState = currentStyle.reduce(function (state, backgroundcolor) {
          return _draftJs.RichUtils.toggleInlineStyle(state, backgroundcolor);
        }, nextEditorState);
      }
      if (!currentStyle.has(backgroundcolor)) {
        nextEditorState = _draftJs.RichUtils.toggleInlineStyle(nextEditorState, backgroundcolor);
      }
      _this.onChange(nextEditorState);
    };

    _this._toggleAlign = function (align) {
      var editorState = _this.state.editorState;

      var selection = editorState.getSelection();
      var nextContentState = Object.keys(_custom.ALIGN).reduce(function (contentState, align) {
        return _draftJs.Modifier.removeInlineStyle(contentState, selection, align);
      }, editorState.getCurrentContent());
      var nextEditorState = _draftJs.EditorState.push(editorState, nextContentState, 'change-inline-style');
      var currentStyle = editorState.getCurrentInlineStyle();
      if (selection.isCollapsed()) {
        nextEditorState = currentStyle.reduce(function (state, align) {
          return _draftJs.RichUtils.toggleInlineStyle(state, align);
        }, nextEditorState);
      }
      if (!currentStyle.has(align)) {
        nextEditorState = _draftJs.RichUtils.toggleInlineStyle(nextEditorState, align);
      }
      _this.onChange(nextEditorState);
      _this.onChange(_draftJs.RichUtils.toggleBlockType(_this.state.editorState, align));
    };

    var decorator = new _draftJs.CompositeDecorator([{
      strategy: findLinkEntities,
      component: Link
    }]);
    //
    for (var fn in DraftTextHandlers) {
      if (typeof DraftTextHandlers[fn] === "function") {
        _this[fn] = DraftTextHandlers[fn].bind(_this);
      }
    }
    //
    _this.defaultSetting = {
      placeholder: 'Write somthing...'
    };
    //
    _this.state = {
      editorState: _draftJs.EditorState.createEmpty(decorator),
      editMode: 0,
      placeholder: _this.hasPlaceholder()
    };
    //
    _this.focus = function (editorState) {
      _this.refs.editor.focus();
    };
    //
    _this.onChange = function (editorState) {
      _this.setState({ editorState: editorState });

      _this.stateCache(_this.props.onEditorChange, editorState);
      // console.log(editorState.getCurrentContent()
      //                        .getBlockForKey(editorState.getSelection().getStartKey())
      //                        .getText())
    };
    _this.stateCache = function (EditorChange, editorState) {
      if (!(typeof EditorChange === 'function')) {
        throw new TypeError('Value of argument "EditorChange" violates contract.\n\nExpected:\nFunction\n\nGot:\n' + _inspect(EditorChange));
      }

      if (!(editorState instanceof Object)) {
        throw new TypeError('Value of argument "editorState" violates contract.\n\nExpected:\nObject\n\nGot:\n' + _inspect(editorState));
      }

      EditorChange({
        getEditorState: editorState,
        getCurrentContent: editorState.getCurrentContent(),
        getStateText: editorState.getCurrentContent().getBlockForKey(editorState.getSelection().getStartKey()).getText(),
        getCustomState: function getCustomState(editorStateKey) {
          if (!(typeof editorStateKey === 'string')) {
            throw new TypeError('Value of argument "editorStateKey" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(editorStateKey));
          }

          return editorState[editorStateKey]();
        }
      });
    };
    //
    _this.onDoHandle = function (editorState, action) {
      var newEditorState = undefined;
      switch (action) {
        case 'undo':
          newEditorState = _draftJs.EditorState.undo(editorState);
          break;
        case 'redo':
          newEditorState = _draftJs.EditorState.redo(editorState);
          break;
      }
      if (newEditorState) {
        _this._setEditorState(newEditorState);
      }
    };
    //
    _this.toggleFontSize = function (size) {
      return _this._toggleFontSize(size);
    };
    _this.toggleFontFamily = function (family) {
      return _this._toggleFontFamily(family);
    };
    _this.toggleInlineStyle = function (style) {
      return _this._toggleInlineStyle(style);
    };
    _this.toggleBlockType = function (type) {
      return _this._toggleBlockType(type);
    };
    _this.toggleColor = function (color) {
      return _this._toggleColor(color);
    };
    _this.toggleBackgroundColor = function (backgroundcolor) {
      return _this._toggleBackgroundColor(backgroundcolor);
    };
    _this.toggleAlign = function (align) {
      return _this._toggleAlign(align);
    };
    //
    _this.logState = function () {
      var content = _this.state.editorState.getCurrentContent();
      console.log((0, _draftJs.convertToRaw)(content));
    };
    _this.logClear = function () {
      console.clear();
    };
    return _this;
  }

  _createClass(DraftText, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var editorState = this.state.editorState;

      var StateLog = this.state.editMode ? _react2.default.createElement(
        'span',
        { style: { fontSize: '14px' } },
        ' ',
        _react2.default.createElement(MaterialButton, {
          label: 'CLEAR LOG',
          onClick: this.logClear
        })
      ) : null;
      this.checkRootStyle = function () {
        return _this2.props.editorStyle !== undefined && _this2.props.editorStyle.root !== undefined;
      };
      this.checkRootControlStyle = function () {
        return _this2.props.editorStyle !== undefined && _this2.props.editorStyle['root-control'] !== undefined;
      };
      this.checkRootInputStyle = function () {
        return _this2.props.editorStyle !== undefined && _this2.props.editorStyle['root-input'] !== undefined;
      };
      var rootStyle = this.checkRootStyle ? this.props.editorStyle.root : {};
      var rootControlStyle = this.checkRootControlStyle ? this.props.editorStyle['root-control'] : {};
      var rootInputStyle = this.checkRootInputStyle ? this.props.editorStyle['root-input'] : {};
      return _react2.default.createElement(
        'div',
        { style: (0, _merge2.default)(_draftText2.default.root, rootStyle) },
        _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(FontFamilyControls, {
            editorState: editorState,
            onToggle: this.toggleFontFamily,
            customStyle: rootControlStyle
          }),
          _react2.default.createElement(FontSizeControls, {
            editorState: editorState,
            onToggle: this.toggleFontSize,
            customStyle: rootControlStyle
          }),
          _react2.default.createElement(TextControls, {
            editorState: editorState,
            onToggle: this.toggleInlineStyle
          }),
          _react2.default.createElement(LinkControls, {
            onHandlLink: this._onHandlLink
          }),
          _react2.default.createElement(BlockControls, {
            editorState: editorState,
            onToggle: this.toggleBlockType
          }),
          _react2.default.createElement(ColorControls, {
            editorState: editorState,
            onToggle: this.toggleColor
          }),
          _react2.default.createElement(BackgroundControls, {
            editorState: editorState,
            onToggle: this.toggleBackgroundColor
          }),
          _react2.default.createElement(ContentControls, {
            editorState: editorState,
            onDoHandle: this.onDoHandle
          }),
          StateLog
        ),
        _react2.default.createElement(
          'div',
          { style: (0, _merge2.default)(_draftText2.default.editor, rootInputStyle), onClick: function onClick() {
              _this2.focus(editorState);
            } },
          _react2.default.createElement(_draftJs.Editor, {
            customStyleMap: (0, _merge2.default)(_custom.COLORS, _custom.BACKGROUNDCOLORS, _custom.ALIGN, _custom.FONTSIZE, _custom.FONTFAMILY),
            editorState: editorState,
            readOnly: false,
            onChange: this.onChange,
            placeholder: this.state.placeholder,
            blockStyleFn: getBlockStyle,
            ref: 'editor',
            suppressContentEditableWarning: false
          })
        )
      );
    }
  }]);

  return DraftText;
}(_react.Component);

exports.default = DraftText;
;

var Link = function Link(props) {
  var _Entity$get$getData = _draftJs.Entity.get(props.entityKey).getData();

  var href = _Entity$get$getData.href;

  return _react2.default.createElement(
    'a',
    { href: href, style: _draftText2.default.meepEditorLink },
    props.children
  );
};

var FontFamilyControls = function (_Component2) {
  _inherits(FontFamilyControls, _Component2);

  function FontFamilyControls(props, context) {
    _classCallCheck(this, FontFamilyControls);

    var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(FontFamilyControls).call(this, props, context));

    _this3.state = {
      onOpen: false
    };

    _this3._onOpen = function () {
      _this3.setState({
        onOpen: !_this3.state.onOpen
      });
    };
    return _this3;
  }

  _createClass(FontFamilyControls, [{
    key: 'render',
    value: function render() {
      var _this4 = this;

      var currentStyle = this.props.editorState.getCurrentInlineStyle();
      var fontFamily = 'Arial';
      var itemMap = ['Arial', 'Arial Black', 'Comic Sans MS', 'Courier', 'Courier New', '標楷體', 'Helvetica', 'Impace', 'Lucida Grande', 'Lucida Sans', '微軟正黑體', 'Monospace', '新細明體', 'Sans Serif', 'Serif', 'Tahoma', 'Times', 'Times New Roman', 'Verdana'].map(function (family, idx) {
        if (currentStyle.has(_inline.FONTFAMILYSTYLE[idx].style)) {
          fontFamily = _inline.FONTFAMILYSTYLE[idx].style;
        }
        return _react2.default.createElement(SelectFamilyItem, {
          active: currentStyle.has(_inline.FONTFAMILYSTYLE[idx].style),
          key: 'font_family_button_' + idx,
          size: family,
          style: _inline.FONTFAMILYSTYLE[idx].style,
          onToggle: _this4.props.onToggle,
          onOpen: _this4._onOpen
        });
      });
      var items = this.state.onOpen ? _react2.default.createElement(
        'div',
        {
          style: _draftText2.default.meepEditorSelectItemBox
        },
        itemMap
      ) : null;
      var customControlStyle = this.props.customStyle;
      return _react2.default.createElement(
        'div',
        {
          style: _draftText2.default.meepEditorInline
        },
        _react2.default.createElement(
          'div',
          {
            style: (0, _merge2.default)(_draftText2.default.meepEditorSelectMainBox, customControlStyle, this.state.onOpen ? _draftText2.default.meepEditorSelectMainBoxOpen : null)
          },
          _react2.default.createElement(
            'div',
            {
              onClick: this._onOpen
            },
            _react2.default.createElement(
              'span',
              {
                style: _draftText2.default.meepEditorSelectBoxLabel
              },
              fontFamily
            ),
            _react2.default.createElement('i', {
              style: _draftText2.default.meepEditorSelectBoxIcon,
              className: 'fa fa-caret-down' })
          ),
          items
        )
      );
    }
  }]);

  return FontFamilyControls;
}(_react.Component);

var FontSizeControls = function (_Component3) {
  _inherits(FontSizeControls, _Component3);

  function FontSizeControls(props, context) {
    _classCallCheck(this, FontSizeControls);

    var _this5 = _possibleConstructorReturn(this, Object.getPrototypeOf(FontSizeControls).call(this, props, context));

    _this5.state = {
      onOpen: false
    };

    _this5._onOpen = function () {
      _this5.setState({
        onOpen: !_this5.state.onOpen
      });
    };
    return _this5;
  }

  _createClass(FontSizeControls, [{
    key: 'render',
    value: function render() {
      var _this6 = this;

      var currentStyle = this.props.editorState.getCurrentInlineStyle();
      var fontSize = 10;
      var itemMap = [10, 13, 16, 20, 24, 28, 32].map(function (size, idx) {
        if (currentStyle.has(_inline.FONTSIZESTYLE[idx].style)) {
          fontSize = _inline.FONTSIZESTYLE[idx].style.split('-')[1];
        }
        return _react2.default.createElement(SelectItem, {
          active: currentStyle.has(_inline.FONTSIZESTYLE[idx].style),
          key: 'font_size_button_' + idx,
          size: size,
          style: _inline.FONTSIZESTYLE[idx].style,
          onToggle: _this6.props.onToggle,
          onOpen: _this6._onOpen
        });
      });
      var items = this.state.onOpen ? _react2.default.createElement(
        'div',
        {
          style: _draftText2.default.meepEditorSelectItemBox
        },
        itemMap
      ) : null;
      var customControlStyle = this.props.customStyle;
      return _react2.default.createElement(
        'div',
        {
          style: _draftText2.default.meepEditorInline
        },
        _react2.default.createElement(
          'div',
          {
            style: (0, _merge2.default)(_draftText2.default.meepEditorSelectMainBox, customControlStyle, this.state.onOpen ? _draftText2.default.meepEditorSelectMainBoxOpen : {})
          },
          _react2.default.createElement(
            'div',
            {
              onClick: this._onOpen
            },
            _react2.default.createElement(
              'span',
              {
                style: _draftText2.default.meepEditorSelectBoxLabel
              },
              fontSize,
              ' px'
            ),
            _react2.default.createElement('i', {
              style: _draftText2.default.meepEditorSelectBoxIcon,
              className: 'fa fa-caret-down' })
          ),
          items
        )
      );
    }
  }]);

  return FontSizeControls;
}(_react.Component);

var SelectItem = function (_Component4) {
  _inherits(SelectItem, _Component4);

  function SelectItem(props, context) {
    _classCallCheck(this, SelectItem);

    var _this7 = _possibleConstructorReturn(this, Object.getPrototypeOf(SelectItem).call(this, props, context));

    _this7.state = {
      hover: false
    };

    _this7.onToggle = function (e) {
      e.preventDefault();
      _this7.props.onToggle(_this7.props.style);
    };

    _this7._onHover = function () {
      _this7.setState({
        hover: true
      });
    };
    _this7._onLeave = function () {
      _this7.setState({
        hover: false
      });
    };
    return _this7;
  }

  _createClass(SelectItem, [{
    key: 'render',
    value: function render() {
      var _this8 = this;

      return _react2.default.createElement(
        'span',
        {
          style: (0, _merge2.default)(_draftText2.default.meepEditorSelectItem, this.state.hover ? _draftText2.default.meepEditorSelectItemHover : null, this.props.active ? _draftText2.default.meepEditorActiveButton : null),
          onMouseOver: this._onHover,
          onMouseLeave: this._onLeave,
          onClick: function onClick(event) {
            _this8.onToggle(event);
            _this8.props.onOpen();
          }
        },
        this.props.size,
        ' px'
      );
    }
  }]);

  return SelectItem;
}(_react.Component);

var SelectFamilyItem = function (_Component5) {
  _inherits(SelectFamilyItem, _Component5);

  function SelectFamilyItem(props, context) {
    _classCallCheck(this, SelectFamilyItem);

    var _this9 = _possibleConstructorReturn(this, Object.getPrototypeOf(SelectFamilyItem).call(this, props, context));

    _this9.state = {
      hover: false
    };

    _this9.onToggle = function (e) {
      e.preventDefault();
      _this9.props.onToggle(_this9.props.style);
    };

    _this9._onHover = function () {
      _this9.setState({
        hover: true
      });
    };
    _this9._onLeave = function () {
      _this9.setState({
        hover: false
      });
    };
    return _this9;
  }

  _createClass(SelectFamilyItem, [{
    key: 'render',
    value: function render() {
      var _this10 = this;

      return _react2.default.createElement(
        'span',
        {
          style: (0, _merge2.default)(_draftText2.default.meepEditorSelectFamilyItem, this.props.active ? _draftText2.default.meepEditorActiveButton : null, this.state.hover ? _draftText2.default.meepEditorSelectItemHover : null),
          onMouseOver: this._onHover,
          onMouseLeave: this._onLeave,
          onClick: function onClick(event) {
            _this10.onToggle(event);
            _this10.props.onOpen();
          }
        },
        this.props.size
      );
    }
  }]);

  return SelectFamilyItem;
}(_react.Component);

var TextControls = function TextControls(props) {
  var currentStyle = props.editorState.getCurrentInlineStyle();
  var button = _inline.TEXTSTYLE.map(function (type, index) {
    return _react2.default.createElement(StyleButton, {
      key: 'text_button_' + index,
      active: currentStyle.has(type.style),
      label: _react2.default.createElement('i', { className: type.label }),
      style: type.style,
      onToggle: props.onToggle
    });
  });
  return _react2.default.createElement(
    'div',
    {
      style: (0, _merge2.default)(_draftText2.default.controls, _draftText2.default.meepEditorInline)
    },
    button
  );
};

var LinkControls = function LinkControls(props) {
  var onHandlLink = props.onHandlLink;

  return _react2.default.createElement(
    'span',
    null,
    _react2.default.createElement(
      'span',
      {
        style: (0, _merge2.default)(_draftText2.default.meepEditorDefaultColor, _draftText2.default.meepEditorDefaultButton),
        onClick: function onClick(e) {
          onHandlLink(e, 'addLink');
        }
      },
      _react2.default.createElement('i', { className: 'fa fa-link' })
    ),
    _react2.default.createElement(
      'span',
      {
        style: (0, _merge2.default)(_draftText2.default.meepEditorDefaultColor, _draftText2.default.meepEditorDefaultButton),
        onClick: function onClick(e) {
          onHandlLink(e, 'removeLink');
        }
      },
      _react2.default.createElement('i', { className: 'fa fa-unlink' })
    )
  );
};

var BlockControls = function BlockControls(props) {
  var editorState = props.editorState;

  var selection = editorState.getSelection();
  var blockType = editorState.getCurrentContent().getBlockForKey(selection.getStartKey()).getType();
  var button = _block2.default.map(function (type, index) {
    return _react2.default.createElement(StyleButton, {
      key: 'block_button_' + index,
      active: type.style === blockType,
      label: _react2.default.createElement('i', { className: type.label }),
      style: type.style,
      onToggle: props.onToggle
    });
  });
  return _react2.default.createElement(
    'div',
    {
      style: _draftText2.default.meepEditorInline
    },
    button
  );
};

var ColorControls = function (_Component6) {
  _inherits(ColorControls, _Component6);

  function ColorControls(props, context) {
    _classCallCheck(this, ColorControls);

    var _this11 = _possibleConstructorReturn(this, Object.getPrototypeOf(ColorControls).call(this, props, context));

    _this11.state = {
      isOpen: false
    };

    _this11._onOpen = function () {
      _this11.setState({
        isOpen: !_this11.state.isOpen
      });
    };
    return _this11;
  }

  _createClass(ColorControls, [{
    key: 'render',
    value: function render() {
      var _this12 = this;

      var editorState = this.props.editorState;

      var currentStyle = editorState.getCurrentInlineStyle();
      var button = this.state.isOpen ? _inline.COLORSTYLE.map(function (type) {
        return _react2.default.createElement(ColorButton, {
          active: currentStyle.has(type.style),
          label: type.label,
          style: type.style,
          onToggle: _this12.props.onToggle
        });
      }) : null;
      return _react2.default.createElement(
        'div',
        {
          style: _draftText2.default.meepEditorInline
        },
        _react2.default.createElement(
          'div',
          {
            style: (0, _merge2.default)(_draftText2.default.meepEditorDefaultButton, _draftText2.default.meepEditorActionSelect),
            onClick: this._onOpen
          },
          _react2.default.createElement('i', { className: 'fa fa-font' })
        ),
        _react2.default.createElement(
          'div',
          {
            style: _draftText2.default.meepEditorActiveColorBox
          },
          button
        )
      );
    }
  }]);

  return ColorControls;
}(_react.Component);

var BackgroundControls = function (_Component7) {
  _inherits(BackgroundControls, _Component7);

  function BackgroundControls(props, context) {
    _classCallCheck(this, BackgroundControls);

    var _this13 = _possibleConstructorReturn(this, Object.getPrototypeOf(BackgroundControls).call(this, props, context));

    _this13.state = {
      isOpen: false
    };

    _this13._onOpen = function () {
      _this13.setState({
        isOpen: !_this13.state.isOpen
      });
    };
    return _this13;
  }

  _createClass(BackgroundControls, [{
    key: 'render',
    value: function render() {
      var _this14 = this;

      var editorState = this.props.editorState;

      var currentStyle = editorState.getCurrentInlineStyle();
      var button = this.state.isOpen ? _inline.BACKGROUNDCOLORSTYLE.map(function (type) {
        return _react2.default.createElement(BackgroundButton, {
          active: currentStyle.has(type.style),
          label: type.label,
          style: type.style,
          onToggle: _this14.props.onToggle
        });
      }) : null;
      return _react2.default.createElement(
        'div',
        {
          style: _draftText2.default.meepEditorInline
        },
        _react2.default.createElement(
          'div',
          {
            style: (0, _merge2.default)(_draftText2.default.meepEditorDefaultButton, _draftText2.default.meepEditorActionSelect),
            onClick: this._onOpen
          },
          _react2.default.createElement('i', { className: 'fa fa-cog' })
        ),
        _react2.default.createElement(
          'div',
          {
            style: _draftText2.default.meepEditorActiveBackgroundBox
          },
          button
        )
      );
    }
  }]);

  return BackgroundControls;
}(_react.Component);

var ContentControls = function ContentControls(props) {
  return _react2.default.createElement(
    'div',
    {
      style: _draftText2.default.meepEditorInline
    },
    _react2.default.createElement(ContentButton, {
      label: _react2.default.createElement('i', { className: 'fa fa-undo' }),
      doAction: 'undo',
      editorState: props.editorState,
      onDoHandle: props.onDoHandle
    }),
    _react2.default.createElement(ContentButton, {
      label: _react2.default.createElement('i', { className: 'fa fa-repeat' }),
      doAction: 'redo',
      editorState: props.editorState,
      onDoHandle: props.onDoHandle
    })
  );
};

var ContentButton = function (_Component8) {
  _inherits(ContentButton, _Component8);

  function ContentButton(props) {
    _classCallCheck(this, ContentButton);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ContentButton).call(this, props));
  }

  _createClass(ContentButton, [{
    key: 'render',
    value: function render() {
      var _this16 = this;

      return _react2.default.createElement(
        'span',
        {
          style: (0, _merge2.default)(_draftText2.default.meepEditorDefaultColor, _draftText2.default.meepEditorDefaultButton),
          onMouseDown: function onMouseDown() {
            _this16.props.onDoHandle(_this16.props.editorState, _this16.props.doAction);
          }
        },
        this.props.label
      );
    }
  }]);

  return ContentButton;
}(_react.Component);

var StyleButton = function (_Component9) {
  _inherits(StyleButton, _Component9);

  function StyleButton(props) {
    _classCallCheck(this, StyleButton);

    var _this17 = _possibleConstructorReturn(this, Object.getPrototypeOf(StyleButton).call(this, props));

    _this17.onToggle = function (e) {
      e.preventDefault();
      _this17.props.onToggle(_this17.props.style);
    };
    return _this17;
  }

  _createClass(StyleButton, [{
    key: 'render',
    value: function render() {
      var style = undefined;
      var labelColor = undefined;
      if (this.props.active) {
        style = _draftText2.default.meepEditorActiveButton;
        labelColor = '#437A82';
      } else {
        style = _draftText2.default.styleButton;
        labelColor = '#59bcc9';
      }

      return _react2.default.createElement(
        'span',
        {
          style: (0, _merge2.default)(style, _draftText2.default.meepEditorDefaultButton),
          labelColor: labelColor,
          onMouseDown: this.onToggle
        },
        this.props.label
      );
    }
  }]);

  return StyleButton;
}(_react.Component);

var ColorButton = function (_Component10) {
  _inherits(ColorButton, _Component10);

  function ColorButton(props) {
    _classCallCheck(this, ColorButton);

    var _this18 = _possibleConstructorReturn(this, Object.getPrototypeOf(ColorButton).call(this, props));

    _this18.onToggle = function (e) {
      e.preventDefault();
      _this18.props.onToggle(_this18.props.style);
    };
    return _this18;
  }

  _createClass(ColorButton, [{
    key: 'render',
    value: function render() {
      var style = undefined;
      var labelColor = undefined;
      if (this.props.active) {
        style = _draftText2.default.meepEditorActiveColorButton;
      } else {
        style = _draftText2.default.styleButton;
      }

      return _react2.default.createElement('span', {
        style: (0, _merge2.default)(_draftText2.default.meepEditorDefaultColorButton, style, { backgroundColor: this.props.style }),
        onMouseDown: this.onToggle
      });
    }
  }]);

  return ColorButton;
}(_react.Component);

var BackgroundButton = function (_Component11) {
  _inherits(BackgroundButton, _Component11);

  function BackgroundButton(props) {
    _classCallCheck(this, BackgroundButton);

    var _this19 = _possibleConstructorReturn(this, Object.getPrototypeOf(BackgroundButton).call(this, props));

    _this19.onToggle = function (e) {
      e.preventDefault();
      _this19.props.onToggle(_this19.props.style);
    };
    return _this19;
  }

  _createClass(BackgroundButton, [{
    key: 'render',
    value: function render() {
      var style = undefined;
      var labelColor = undefined;
      if (this.props.active) {
        style = _draftText2.default.meepEditorActiveColorButton;
      } else {
        style = _draftText2.default.styleButton;
      }
      return _react2.default.createElement('span', {
        style: (0, _merge2.default)(_draftText2.default.meepEditorDefaultColorButton, style, { backgroundColor: this.props.style.split('-')[1] }),
        onMouseDown: this.onToggle
      });
    }
  }]);

  return BackgroundButton;
}(_react.Component);

/*暫時解決 React DOM editor 時會出現警告錯誤，等待 React 15.0 版修正。
  issue: https://github.com/facebook/react/issues/5837
 */


console.error = function () {
  var error = console.error;

  return function (exception) {
    if ((exception + '').indexOf('Warning: A component is `contentEditable`') != 0) {
      error.apply(console, arguments);
    }
  };
}();

function _inspect(input, depth) {
  var maxDepth = 4;
  var maxKeys = 15;

  if (depth === undefined) {
    depth = 0;
  }

  depth += 1;

  if (input === null) {
    return 'null';
  } else if (input === undefined) {
    return 'void';
  } else if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
    return typeof input === 'undefined' ? 'undefined' : _typeof(input);
  } else if (Array.isArray(input)) {
    if (input.length > 0) {
      var _ret = function () {
        if (depth > maxDepth) return {
            v: '[...]'
          };

        var first = _inspect(input[0], depth);

        if (input.every(function (item) {
          return _inspect(item, depth) === first;
        })) {
          return {
            v: first.trim() + '[]'
          };
        } else {
          return {
            v: '[' + input.slice(0, maxKeys).map(function (item) {
              return _inspect(item, depth);
            }).join(', ') + (input.length >= maxKeys ? ', ...' : '') + ']'
          };
        }
      }();

      if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
    } else {
      return 'Array';
    }
  } else {
    var keys = Object.keys(input);

    if (!keys.length) {
      if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
        return input.constructor.name;
      } else {
        return 'Object';
      }
    }

    if (depth > maxDepth) return '{...}';
    var indent = '  '.repeat(depth - 1);
    var entries = keys.slice(0, maxKeys).map(function (key) {
      return (/^([A-Z_$][A-Z0-9_$]*)$/i.test(key) ? key : JSON.stringify(key)) + ': ' + _inspect(input[key], depth) + ';';
    }).join('\n  ' + indent);

    if (keys.length >= maxKeys) {
      entries += '\n  ' + indent + '...';
    }

    if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
      return input.constructor.name + ' {\n  ' + indent + entries + '\n' + indent + '}';
    } else {
      return '{\n  ' + indent + entries + '\n' + indent + '}';
    }
  }
}