"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const Task_1 = __importDefault(require("../../Models/Task"));
const redis = __importStar(require("redis"));
const util_1 = require("util");
const redisClient = redis.createClient({ url: process.env.REDIS_URL });
redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.connect();
const lpushAsync = (0, util_1.promisify)(redisClient.LPUSH).bind(redisClient);
const redisKey = process.env.REDIS_MY_VAR;
const addTask = (message) => __awaiter(void 0, void 0, void 0, function* () {
    const newMessage = message.toString();
    const newItem = { name: newMessage, time: new Date() };
    try {
        const response = yield redisClient.LPUSH(redisKey, JSON.stringify(newItem));
        if (response) {
            yield checkRedisCountAndMoveToMongo();
        }
        else {
            throw new Error("Error adding the item in Redis");
        }
    }
    catch (error) {
        console.error("Error adding task:", error);
        throw error;
    }
});
const deleteTask = (messsage) => {
    // Implement deletion logic based on req parameters
};
const fetchAllTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasksFromMongo = yield Task_1.default.find().sort({ time: -1 });
        if (!tasksFromMongo) {
            return res.status(404).send('No tasks found');
        }
        let cachedTasks = yield checkRedisCountAndMoveToMongo();
        for (let i = cachedTasks.length - 1; i >= 0; i--) {
            const cachedTaskData = JSON.parse(cachedTasks[i]);
            const newTask = new Task_1.default({ name: cachedTaskData.name, time: new Date(cachedTaskData.time) }); // Create a new instance of Task model
            tasksFromMongo.unshift(newTask);
        }
        return res.status(200).json({ success: true, tasks: tasksFromMongo });
    }
    catch (error) {
        console.error("Error fetching tasks:", error);
        return res.status(500).send('Server error');
    }
});
function checkRedisCountAndMoveToMongo() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const count = yield redisClient.LLEN(redisKey);
            if (count > 5) {
                let tasks = yield redisClient.LRANGE(redisKey, 0, -1);
                tasks = tasks.map((task) => JSON.parse(task));
                const savedTasks = yield Task_1.default.insertMany(tasks);
                yield redisClient.DEL(redisKey);
                return [];
            }
            else {
                return yield redisClient.LRANGE(redisKey, 0, -1);
            }
        }
        catch (error) {
            console.error("Error checking Redis count and moving to MongoDB:", error);
            return [];
        }
    });
}
exports.default = { addTask, deleteTask, fetchAllTasks };
