import React from "react";
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
            close?: () => void;
        };
    };
}
declare const Window: React.FC<WindowProps>;
export default Window;
