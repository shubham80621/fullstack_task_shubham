import cors from 'cors';
import mqtt from 'mqtt';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

import TaskController from './src/Controlles/Task';
import connectDb from './src/db';

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
const mongoUri = process.env.MONGO_URI as string;
const mqttUri = process.env.MQTT_URI as string;

if (!mongoUri || !mqttUri) {
  throw new Error("Environment variables MONGO_URI and MQTT_URI are required.");
}

connectDb(mongoUri);

const mqttClient = mqtt.connect(mqttUri);

mqttClient.on('connect', () => {
  mqttClient.subscribe('/add', (err: Error | null) => {
    if (!err) {
      console.log('Subscribed to /add topic');
    }
  });

  mqttClient.subscribe('/delete', (err: Error | null) => {
    if (!err) {
      console.log('Subscribed to /delete topic');
    }
  });
});

mqttClient.on('message', async (topic: string, message: Buffer) => {
  try {
    const parsedMessage = message.toString();
    if (topic === '/add') {
      await TaskController.addTask(parsedMessage);
    } else if (topic === '/delete') {
      await TaskController.deleteTask(parsedMessage);
    }
  } catch (err) {
    console.error(`Error handling message for topic ${topic}:`, err);
  }
});

const app = express();

app.use(cors());
app.use(express.json());


app.get('/fetchAllTasks', TaskController.fetchAllTasks);
app.post('/fetchAllTasks', TaskController.fetchAllTasks);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
