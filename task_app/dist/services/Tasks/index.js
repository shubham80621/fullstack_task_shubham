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
const mqtt_1 = __importDefault(require("mqtt"));
const client = mqtt_1.default.connect(`${process.env.REACT_APP_MQTT_URL}`);
client.on('connect', () => {
    console.log('Connected to MQTT broker');
});
const fetchAllTasks = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ApiUrl = `${process.env.REACT_APP_BASE_URL}/fetchAlltasks`;
        let response = yield fetch(ApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        return yield response.json();
    }
    catch (error) {
        console.error(error);
        throw error;
    }
});
const publishData = (topic, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!client.connected) {
            console.error('Client is not connected');
            return false;
        }
        console.log("publishing, topic: " + topic + ", data: " + data);
        client.publish(topic, data);
        return true;
    }
    catch (error) {
        console.error(error);
        return false;
    }
});
exports.default = {
    fetchAllTasks,
    publishData
};
