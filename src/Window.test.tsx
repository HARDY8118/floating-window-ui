import React from "react";
import { render, screen } from "@testing-library/react";
import Window from "./Window";

test("Checking window properties", () => {
  let { container } = render(
    <React.StrictMode>
      <Window
        id="test-window-1"
        height={20}
        width={20}
        titleBar={{
          icon: "☹",
          title: "Test Window",
          buttons: { minimize: true, maximize: true },
        }}
      />
    </React.StrictMode>
  );
  // screen.debug();
  const testWindow =
    container.querySelector<HTMLDivElement>(".window-container");

  expect(testWindow).not.toBeNull();
  expect(testWindow?.getAttribute("id")).toBe("test-window-1");
  expect(testWindow?.style.height).toBe("20px");
  expect(testWindow?.style.width).toBe("20px");
  expect(testWindow?.style.top).toBe("0px");
  expect(testWindow?.style.left).toBe("0px");
  expect(testWindow?.style.resize).toBe("none");

  const testWindowTitleBar = testWindow?.querySelector(".title-bar");
  expect(testWindowTitleBar).not.toBeNull();

  const testWindowTitleBarIcon = testWindowTitleBar?.querySelector(".icon");
  expect(testWindowTitleBarIcon).not.toBeNull();
  expect(testWindowTitleBarIcon?.textContent).toBe("☹");

  const testWindowTitleBarTitle =
    testWindowTitleBar?.querySelector(".windowTitle");
  expect(testWindowTitleBarIcon).not.toBeNull();

  const titleBarButtons =
    testWindowTitleBar?.querySelector<HTMLDivElement>(".buttonContainer");
  expect(titleBarButtons).not.toBeNull();

  const minimizeButton = titleBarButtons?.querySelector<HTMLSpanElement>(
    ".windowButton:nth-child(1)"
  );
  expect(minimizeButton).not.toBeNull();
  expect(minimizeButton?.textContent).toBe("▁");

  const maximizeButton = titleBarButtons?.querySelector<HTMLSpanElement>(
    ".windowButton:nth-child(2)"
  );
  expect(maximizeButton).not.toBeNull();
  expect(maximizeButton?.textContent).toBe("□");
});

test("Autogeneratting window id", () => {
  let { container } = render(
    // @ts-ignore
    <Window />
  );

  const testWindowAutoId =
    container.querySelector<HTMLDivElement>(".window-container");

  expect(testWindowAutoId).not.toBeNull();
  expect(testWindowAutoId?.getAttribute("id")).toMatch(/[0-9]{13}/);
});
