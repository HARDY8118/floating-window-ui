import React, { useRef } from "react";
import "./Window.css";

interface WindowProps {
  id: string;
  children?: any;
  height: number;
  width: number;
  top?: number;
  left?: number;
  resizable?: boolean;
  titleBar?: {
    icon?: string | HTMLImageElement;
    title?: string;
    buttons?: {
      minimize?: boolean;
      maximize?: boolean;
      close?: boolean;
    };
  };
}

const nextZIndex: () => number = () => {
  let maxZ = 0;
  for (let w of document.querySelectorAll<HTMLDivElement>(
    ".window-container"
  )) {
    let z = parseInt(w.style.zIndex);

    maxZ = Math.max(isNaN(z) ? 0 : z, maxZ);
  }
  return maxZ + 1;
};

const Window: React.FC<WindowProps> = (props: WindowProps) => {
  let properties = Object.assign(
    {
      id: props.id && props.id.length ? props.id : Date.now().toString(),
      children: null,
      height: 0,
      width: 0,
      top: 0,
      left: 0,
      resizable: false,
      titleBar: Object.assign(
        {
          icon: " ",
          title: "Untitled window",
          buttons: Object.assign(
            {
              minimize: true,
              maximize: true,
              close: true,
            },
            (props.titleBar && props.titleBar.buttons) || {}
          ),
        },
        props.titleBar
      ),
    },
    props
  );

  if (!properties.id) {
    properties.id = Date.now().toString();
  }

  Object.freeze(properties);

  const [height, setHeight] = React.useState(properties.height);
  const [width, setWidth] = React.useState(properties.width);
  const [top, setTop] = React.useState<number>(properties.top || 0);
  const [left, setLeft] = React.useState<number>(properties.left || 0);
  const [xOffset, setXOffset] = React.useState<number>(0);
  const [yOffset, setYOffset] = React.useState<number>(0);
  const [minimized, setMinimized] = React.useState<boolean>(false);
  const [maximized, setMaximized] = React.useState<boolean>(false);
  const [minimizeIcon, setMinimizeIcon] = React.useState<string>("▁");
  const [maximizeIcon, setMaximizeIcon] = React.useState<string>("□");
  const [contentDisplay, setContentDisplay] = React.useState<boolean>(true);
  const [windowTransition, setWindowTransition] = React.useState("");
  const [level, setLevel] = React.useState<number>(nextZIndex());
  const [visibility, setWindowVisibility] = React.useState<number>(1.0);

  const container = React.useRef<HTMLDivElement>(null);
  const windowTitle = React.useRef<HTMLSpanElement>(null);
  const effectiveHeight = useRef(height);
  const effectiveWidth = useRef(width);

  const animationDuration = 500;

  const handleDragStart = (e: React.DragEvent<HTMLSpanElement>) => {
    setYOffset(e.clientY - top);
    setXOffset(e.clientX - left);
    setLevel(nextZIndex());
    setWindowVisibility(0.5);
  };

  const handleDrag = (e: MouseEvent | React.MouseEvent) => {
    setLeft((e.clientX || e.screenX || xOffset) - xOffset);
    setTop((e.clientY || e.screenY || yOffset) - yOffset);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLSpanElement>) => {
    setLeft((e.clientX || e.screenX) - xOffset);
    setTop((e.clientY || e.screenY) - yOffset);
    setWindowVisibility(1.0);
  };

  const minimize = () => {
    setWindowTransition(`${animationDuration}ms ease-in-out`);
    const parent = document.getElementById(properties.id)?.parentElement;
    if (minimized) {
      setContentDisplay(true);
      effectiveHeight.current = height;
      setTop(parent?.offsetTop || 0);
      setLeft(parent?.offsetLeft || 0);
      setMinimized(false);
      setMinimizeIcon("▁");
      setMaximized(false);
    } else {
      setContentDisplay(false);
      effectiveHeight.current = 32;
      const parent = document.getElementById(properties.id)?.parentElement;
      effectiveWidth.current = width;
      let topPosition =
        (parent?.clientHeight || window.innerHeight) -
        effectiveHeight.current -
        4;

      let leftPosition =
        (parent?.clientWidth || window.innerWidth) - effectiveWidth.current - 4;

      const minimizedWindow = document.elementFromPoint(
        leftPosition + effectiveWidth.current / 2,
        topPosition + effectiveHeight.current / 2
      ) as HTMLDivElement;
      if (
        minimizedWindow &&
        ["window-container", "windowTitle"].includes(
          minimizedWindow?.className || ""
        )
      ) {
        topPosition -= minimizedWindow?.clientHeight + 4;
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
    setWindowTransition(`${animationDuration}ms ease-in-out`);
    const parent = document.getElementById(properties.id)?.parentElement;
    if (maximized) {
      setContentDisplay(true);
      effectiveHeight.current = height;
      effectiveWidth.current = width;
      setTop(parent?.offsetTop || 0);
      setLeft(parent?.offsetLeft || 0);
      setMaximized(false);
      setMaximizeIcon("□");
      setMinimized(false);
      setMinimizeIcon("▁");
    } else {
      setContentDisplay(true);
      effectiveHeight.current = parent?.clientHeight || window.innerHeight;
      effectiveWidth.current = parent?.clientWidth || window.innerWidth;
      setTop(parent?.offsetTop || 0);
      setLeft(parent?.offsetLeft || 0);
      setMaximized(true);
      setMaximizeIcon("❐");
      setMinimized(false);
      setMinimizeIcon("▁");
    }
    setLevel(nextZIndex());
    setTimeout(setWindowTransition, animationDuration + 1, "");
  };

  return (
    <div
      id={properties.id}
      className="window-container"
      style={{
        height: effectiveHeight.current,
        width: effectiveWidth.current,
        top,
        left,
        resize: properties.resizable ? "both" : "none",
        transition: windowTransition,
        zIndex: level,
        opacity: visibility,
      }}
      ref={container}
      onClick={() => {
        setLevel(nextZIndex());
      }}
    >
      {properties.titleBar && (
        <div
          className="title-bar"
          data-parent={properties.id}
          style={{
            opacity: visibility,
          }}
        >
          {properties.titleBar.icon && (
            <span className="icon">{properties.titleBar.icon}</span>
          )}
          <span
            className="windowTitle"
            draggable={true}
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            style={{ opacity: Math.floor(visibility) }}
            ref={windowTitle}
          >
            {properties.titleBar.title}
          </span>
          {properties.titleBar.buttons && (
            <span className="buttonContainer">
              {properties.titleBar.buttons.minimize && (
                <span className="windowButton" onClick={minimize}>
                  {minimizeIcon}
                </span>
              )}
              {properties.titleBar.buttons.maximize && (
                <span className="windowButton" onClick={maximize}>
                  {maximizeIcon}
                </span>
              )}
              {<span className="windowButton">&#10799;</span>}
            </span>
          )}
        </div>
      )}
      <div
        className="content"
        draggable="false"
        style={{
          height: contentDisplay ? "auto" : 0,
          opacity: visibility,
        }}
      >
        {properties.children}
      </div>
    </div>
  );
};

export default Window;
