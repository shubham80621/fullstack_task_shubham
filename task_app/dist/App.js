"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
require("./App.css");
const Tasks_1 = __importDefault(require("./pages/Tasks"));
function App() {
    return (react_1.default.createElement("div", { className: "flex justify-center items-center h-screen" },
        react_1.default.createElement(Tasks_1.default, null)));
}
exports.default = App;
