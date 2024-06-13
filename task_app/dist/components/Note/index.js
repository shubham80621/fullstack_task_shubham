"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Note = ({ value }) => {
    return (react_1.default.createElement("div", { className: 'border-b p-2 text-start snap-start text-slate-600 flex justify-between items-center' },
        react_1.default.createElement("span", null,
            " ",
            value)));
};
exports.default = Note;
