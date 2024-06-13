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
const cors_1 = __importDefault(require("cors"));
const mqtt_1 = __importDefault(require("mqtt"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const Task_1 = __importDefault(require("./src/Controlles/Task"));
const db_1 = __importDefault(require("./src/db"));
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
const mongoUri = process.env.MONGO_URI;
const mqttUri = process.env.MQTT_URI;
if (!mongoUri || !mqttUri) {
    throw new Error("Environment variables MONGO_URI and MQTT_URI are required.");
}
(0, db_1.default)(mongoUri);
const mqttClient = mqtt_1.default.connect(mqttUri);
mqttClient.on('connect', () => {
    mqttClient.subscribe('/add', (err) => {
        if (!err) {
            console.log('Subscribed to /add topic');
        }
    });
    mqttClient.subscribe('/delete', (err) => {
        if (!err) {
            console.log('Subscribed to /delete topic');
        }
    });
});
mqttClient.on('message', (topic, message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsedMessage = message.toString();
        if (topic === '/add') {
            yield Task_1.default.addTask(parsedMessage);
        }
        else if (topic === '/delete') {
            yield Task_1.default.deleteTask(parsedMessage);
        }
    }
    catch (err) {
        console.error(`Error handling message for topic ${topic}:`, err);
    }
}));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/fetchAllTasks', Task_1.default.fetchAllTasks);
app.post('/fetchAllTasks', Task_1.default.fetchAllTasks);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
