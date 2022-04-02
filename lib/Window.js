import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useRef } from "react";
import "./Window.css";
const nextZIndex = () => {
    let maxZ = 0;
    for (let w of document.querySelectorAll(".window-container")) {
        let z = parseInt(w.style.zIndex);
        maxZ = Math.max(isNaN(z) ? 0 : z, maxZ);
    }
    return maxZ + 1;
};
const Window = (props) => {
    let properties = Object.assign({
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
                close: () => { },
            }, (props.titleBar && props.titleBar.buttons) || {}),
        }, props.titleBar),
    }, props);
    if (!properties.id) {
        properties.id = Date.now().toString();
    }
    Object.freeze(properties);
    const [height, setHeight] = React.useState(properties.height);
    const [width, setWidth] = React.useState(properties.width);
    const [top, setTop] = React.useState(properties.top || 0);
    const [left, setLeft] = React.useState(properties.left || 0);
    const [xOffset, setXOffset] = React.useState(0);
    const [yOffset, setYOffset] = React.useState(0);
    const [minimized, setMinimized] = React.useState(false);
    const [maximized, setMaximized] = React.useState(false);
    const [minimizeIcon, setMinimizeIcon] = React.useState("▁");
    const [maximizeIcon, setMaximizeIcon] = React.useState("□");
    const [contentDisplay, setContentDisplay] = React.useState(true);
    const [windowTransition, setWindowTransition] = React.useState("");
    const [level, setLevel] = React.useState(nextZIndex());
    const container = React.useRef(null);
    const titleBar = React.useRef(null);
    const effectiveHeight = useRef(height);
    const effectiveWidth = useRef(width);
    const animationDuration = 500;
    const handleDragStart = (e) => {
        setYOffset(e.clientY - top);
        setXOffset(e.clientX - left);
        setLevel(nextZIndex());
    };
    const handleMove = (e) => {
        setLeft(e.clientX - xOffset);
        setTop(e.clientY - yOffset);
    };
    const minimize = () => {
        var _a, _b;
        setWindowTransition(`${animationDuration}ms ease-in-out`);
        const parent = (_a = document.getElementById(properties.id)) === null || _a === void 0 ? void 0 : _a.parentElement;
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
            const parent = (_b = document.getElementById(properties.id)) === null || _b === void 0 ? void 0 : _b.parentElement;
            effectiveWidth.current = width;
            let topPosition = ((parent === null || parent === void 0 ? void 0 : parent.clientHeight) || window.innerHeight) -
                effectiveHeight.current -
                4;
            let leftPosition = ((parent === null || parent === void 0 ? void 0 : parent.clientWidth) || window.innerWidth) - effectiveWidth.current - 4;
            const minimizedWindow = document.elementFromPoint(leftPosition + effectiveWidth.current / 2, topPosition + effectiveHeight.current / 2);
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
    const maximize = () => {
        var _a;
        setWindowTransition(`${animationDuration}ms ease-in-out`);
        const parent = (_a = document.getElementById(properties.id)) === null || _a === void 0 ? void 0 : _a.parentElement;
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
    return (_jsxs("div", Object.assign({ id: properties.id, className: "window-container", style: {
            height: effectiveHeight.current,
            width: effectiveWidth.current,
            top,
            left,
            resize: properties.resizable ? "both" : "none",
            transition: windowTransition,
            zIndex: level,
        }, ref: container, onClick: () => {
            setLevel(nextZIndex());
        } }, { children: [properties.titleBar && (_jsxs("div", Object.assign({ className: "title-bar", ref: titleBar }, { children: [properties.titleBar.icon && (_jsx("span", Object.assign({ className: "icon" }, { children: properties.titleBar.icon }))), properties.titleBar.title && (_jsx("span", Object.assign({ className: "windowTitle", draggable: true, onDragStart: handleDragStart, onDrag: handleMove, onDragEnd: handleMove }, { children: properties.titleBar.title }))), properties.titleBar.buttons && (_jsxs("span", Object.assign({ className: "buttonContainer" }, { children: [properties.titleBar.buttons.minimize && (_jsx("span", Object.assign({ className: "windowButton", onClick: minimize }, { children: minimizeIcon }))), properties.titleBar.buttons.maximize && (_jsx("span", Object.assign({ className: "windowButton", onClick: maximize }, { children: maximizeIcon }))), _jsx("span", Object.assign({ className: "windowButton" }, { children: "\u2A2F" }))] })))] }))), _jsx("div", Object.assign({ className: "content", draggable: "false", style: {
                    height: contentDisplay ? "auto" : 0,
                } }, { children: properties.children }))] })));
};
export default Window;
