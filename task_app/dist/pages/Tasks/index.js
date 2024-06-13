"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_2 = require("react");
const framer_motion_1 = require("framer-motion");
const Tasks_1 = __importDefault(require("../../services/Tasks"));
const Button_1 = __importDefault(require("../../components/Button"));
const Note_1 = __importDefault(require("../../components/Note"));
const TaskPage = () => {
    const [newTask, setNewTask] = (0, react_2.useState)("");
    const [allTasks, setAllTasks] = (0, react_2.useState)([]);
    (0, react_2.useEffect)(() => {
        fetchAlltasks();
    }, []);
    const fetchAlltasks = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield Tasks_1.default.fetchAllTasks();
            if (response.success) {
                setAllTasks(response.tasks);
            }
        }
        catch (error) {
            console.error(error);
        }
    });
    const handleAddTask = () => __awaiter(void 0, void 0, void 0, function* () {
        if (newTask === "" || !newTask) {
            alert("Please enter task");
            return;
        }
        try {
            const published = yield Tasks_1.default.publishData('/add', newTask);
            if (published) {
                const updatedAllTasks = [...allTasks];
                updatedAllTasks.unshift({ name: newTask });
                setAllTasks(updatedAllTasks);
                setNewTask("");
            }
        }
        catch (error) {
            console.error(error);
        }
    });
    const removeTask = (task) => { };
    return (react_1.default.createElement(framer_motion_1.motion.div, { initial: { opacity: 0, scale: 0.5 }, animate: { opacity: 1, scale: 1 }, transition: {
            duration: 0.8,
            delay: 0.5,
            ease: [0, 0.71, 0.2, 1.01]
        }, className: 'h-screen w-screen sm:w-1/2 sm:h-2/3 d-flex flex flex-col gap-5 p-5 overflow-hidden border shadow sm:rounded-xl' },
        react_1.default.createElement("div", { className: 'flex gap-2 items-center' },
            react_1.default.createElement(framer_motion_1.motion.div, { animate: { rotate: [0, 360, 0, 360],
                    scale: [2, 1, 2, 1],
                    x: [0, 100, 0, 100, 0],
                    y: [0, 100, 0, 100, 0] }, transition: { duration: 2 } },
                react_1.default.createElement("img", { src: 'https://i.pinimg.com/originals/b6/cd/e8/b6cde81d1c489b0e20d85a6e06c5f8f9.png', className: 'h-10' })),
            react_1.default.createElement("span", { className: 'text-xl font-semibold' }, "Note App")),
        react_1.default.createElement("div", { className: 'flex gap-2 ' },
            react_1.default.createElement("input", { className: 'grow p-1 border rounded-md shadow', type: "text", value: newTask, placeholder: 'New notes...', onChange: (e) => setNewTask(e.target.value) }),
            react_1.default.createElement(Button_1.default, { value: "Add", onClick: handleAddTask })),
        react_1.default.createElement("div", { className: 'grow overflow-hidden flex flex-col' },
            react_1.default.createElement("div", { className: 'border-b  p-2 text-start font-bold' }, "Notes:"),
            react_1.default.createElement("div", { className: 'grow overflow-scroll scroll-ts-6 snap-x snap-mandatory text-slate-600' }, allTasks.map((task, index) => react_1.default.createElement(Note_1.default, { key: index, value: task.name }))))));
};
exports.default = TaskPage;
