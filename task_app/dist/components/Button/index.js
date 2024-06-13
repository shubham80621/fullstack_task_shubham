"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const framer_motion_1 = require("framer-motion");
const plus_png_1 = __importDefault(require("../../assets/plus.png"));
const Button = ({ value, onClick }) => {
    return (react_1.default.createElement(framer_motion_1.motion.button, { className: 'w-20 bg-orange-900 rounded text-white flex justify-center items-center gap-2', initial: { opacity: 0.6 }, whileHover: { scale: 1.1,
            transition: { duration: 0.2 },
        }, whileTap: { scale: 0.9 }, whileInView: { opacity: 1 }, onClick: onClick },
        react_1.default.createElement("img", { src: plus_png_1.default, style: { width: 25 } }),
        value));
};
exports.default = Button;
