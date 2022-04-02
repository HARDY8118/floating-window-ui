"use strict";
exports.__esModule = true;
var react_1 = require("react");
require("./Window.css");
var nextZIndex = function () {
    var maxZ = 0;
    for (var _i = 0, _a = document.querySelectorAll(".window-container"); _i < _a.length; _i++) {
        var w = _a[_i];
        var z = parseInt(w.style.zIndex);
        maxZ = Math.max(isNaN(z) ? 0 : z, maxZ);
    }
    return maxZ + 1;
};
var Window = function (props) {
    var properties = Object.assign({
        id: props.id && props.id.length ? props.id : Date.now().toString(),
        children: null,
        height: 0,
        width: 0,
        top: 0,
        left: 0,
        resizable: false,
        titleBar: Object.assign({
            icon: " ",
            title: "Untitled window",
            buttons: Object.assign({
                minimize: true,
                maximize: true,
                close: function () { }
            }, (props.titleBar && props.titleBar.buttons) || {})
        }, props.titleBar)
    }, props);
    if (!properties.id) {
        properties.id = Date.now().toString();
    }
    Object.freeze(properties);
    var _a = react_1["default"].useState(properties.height), height = _a[0], setHeight = _a[1];
    var _b = react_1["default"].useState(properties.width), width = _b[0], setWidth = _b[1];
    var _c = react_1["default"].useState(properties.top || 0), top = _c[0], setTop = _c[1];
    var _d = react_1["default"].useState(properties.left || 0), left = _d[0], setLeft = _d[1];
    var _e = react_1["default"].useState(0), xOffset = _e[0], setXOffset = _e[1];
    var _f = react_1["default"].useState(0), yOffset = _f[0], setYOffset = _f[1];
    var _g = react_1["default"].useState(false), minimized = _g[0], setMinimized = _g[1];
    var _h = react_1["default"].useState(false), maximized = _h[0], setMaximized = _h[1];
    var _j = react_1["default"].useState("▁"), minimizeIcon = _j[0], setMinimizeIcon = _j[1];
    var _k = react_1["default"].useState("□"), maximizeIcon = _k[0], setMaximizeIcon = _k[1];
    var _l = react_1["default"].useState(true), contentDisplay = _l[0], setContentDisplay = _l[1];
    var _m = react_1["default"].useState(""), windowTransition = _m[0], setWindowTransition = _m[1];
    var _o = react_1["default"].useState(nextZIndex()), level = _o[0], setLevel = _o[1];
    var container = react_1["default"].useRef(null);
    var titleBar = react_1["default"].useRef(null);
    var effectiveHeight = (0, react_1.useRef)(height);
    var effectiveWidth = (0, react_1.useRef)(width);
    var animationDuration = 500;
    var handleDragStart = function (e) {
        setYOffset(e.clientY - top);
        setXOffset(e.clientX - left);
        setLevel(nextZIndex());
    };
    var handleMove = function (e) {
        setLeft(e.clientX - xOffset);
        setTop(e.clientY - yOffset);
    };
    var minimize = function () {
        var _a, _b;
        setWindowTransition("".concat(animationDuration, "ms ease-in-out"));
        var parent = (_a = document.getElementById(properties.id)) === null || _a === void 0 ? void 0 : _a.parentElement;
        if (minimized) {
            setContentDisplay(true);
            effectiveHeight.current = height;
            setTop((parent === null || parent === void 0 ? void 0 : parent.offsetTop) || 0);
            setLeft((parent === null || parent === void 0 ? void 0 : parent.offsetLeft) || 0);
            setMinimized(false);
            setMinimizeIcon("▁");
            setMaximized(false);
        }
        else {
            setContentDisplay(false);
            effectiveHeight.current = 32;
            var parent_1 = (_b = document.getElementById(properties.id)) === null || _b === void 0 ? void 0 : _b.parentElement;
            effectiveWidth.current = width;
            var topPosition = ((parent_1 === null || parent_1 === void 0 ? void 0 : parent_1.clientHeight) || window.innerHeight) -
                effectiveHeight.current -
                4;
            var leftPosition = ((parent_1 === null || parent_1 === void 0 ? void 0 : parent_1.clientWidth) || window.innerWidth) - effectiveWidth.current - 4;
            var minimizedWindow = document.elementFromPoint(leftPosition + effectiveWidth.current / 2, topPosition + effectiveHeight.current / 2);
            if (minimizedWindow &&
                ["window-container", "windowTitle"].includes((minimizedWindow === null || minimizedWindow === void 0 ? void 0 : minimizedWindow.className) || "")) {
                topPosition -= (minimizedWindow === null || minimizedWindow === void 0 ? void 0 : minimizedWindow.clientHeight) + 4;
            }
            setTop(topPosition);
            setLeft(leftPosition);
            setMinimized(true);
            setMinimizeIcon("◰");
            setMaximized(false);
        }
        setLevel(nextZIndex());
        setTimeout(setWindowTransition, animationDuration + 1, "");
    };
    var maximize = function () {
        var _a;
        setWindowTransition("".concat(animationDuration, "ms ease-in-out"));
        var parent = (_a = document.getElementById(properties.id)) === null || _a === void 0 ? void 0 : _a.parentElement;
        if (maximized) {
            setContentDisplay(true);
            effectiveHeight.current = height;
            effectiveWidth.current = width;
            setTop((parent === null || parent === void 0 ? void 0 : parent.offsetTop) || 0);
            setLeft((parent === null || parent === void 0 ? void 0 : parent.offsetLeft) || 0);
            setMaximized(false);
            setMaximizeIcon("□");
            setMinimized(false);
            setMinimizeIcon("▁");
        }
        else {
            setContentDisplay(true);
            effectiveHeight.current = (parent === null || parent === void 0 ? void 0 : parent.clientHeight) || window.innerHeight;
            effectiveWidth.current = (parent === null || parent === void 0 ? void 0 : parent.clientWidth) || window.innerWidth;
            setTop((parent === null || parent === void 0 ? void 0 : parent.offsetTop) || 0);
            setLeft((parent === null || parent === void 0 ? void 0 : parent.offsetLeft) || 0);
            setMaximized(true);
            setMaximizeIcon("❐");
            setMinimized(false);
            setMinimizeIcon("▁");
        }
        setLevel(nextZIndex());
        setTimeout(setWindowTransition, animationDuration + 1, "");
    };
    return (<div id={properties.id} className="window-container" style={{
            height: effectiveHeight.current,
            width: effectiveWidth.current,
            top: top,
            left: left,
            resize: properties.resizable ? "both" : "none",
            transition: windowTransition,
            zIndex: level
        }} ref={container} onClick={function () {
            setLevel(nextZIndex());
        }}>
      {properties.titleBar && (<div className="title-bar" ref={titleBar}>
          {properties.titleBar.icon && (<span className="icon">{properties.titleBar.icon}</span>)}
          {properties.titleBar.title && (<span className="windowTitle" draggable={true} onDragStart={handleDragStart} onDrag={handleMove} onDragEnd={handleMove}>
              {properties.titleBar.title}
            </span>)}
          {properties.titleBar.buttons && (<span className="buttonContainer">
              {properties.titleBar.buttons.minimize && (<span className="windowButton" onClick={minimize}>
                  {minimizeIcon}
                </span>)}
              {properties.titleBar.buttons.maximize && (<span className="windowButton" onClick={maximize}>
                  {maximizeIcon}
                </span>)}
              {<span className="windowButton">&#10799;</span>}
            </span>)}
        </div>)}
      <div className="content" draggable="false" style={{
            height: contentDisplay ? "auto" : 0
        }}>
        {properties.children}
      </div>
    </div>);
};
exports["default"] = Window;
