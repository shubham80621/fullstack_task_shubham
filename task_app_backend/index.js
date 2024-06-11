
require('dotenv').config()
const cors = require('cors');
const mqtt = require('mqtt');
const express = require('express');
const TaskControllers = require('./Controlles/tasks.js');
const port = process.env.PORT || 4000; 
const db = require('./db.js');
db.connectDb(process.env.MONGO_URI)

const mqttClient = mqtt.connect(process.env.MQTT_URI);
mqttClient.on('connect', () => {
  mqttClient.subscribe('/add', (err) => {
    if (!err) {
      console.log('Subscribed to /add topic');
    }
  });
});

mqttClient.on('message', async (topic, message) => {
    try{
      if (topic === '/add') {
        TaskControllers.addTask(message)
      }else if(topic === '/delete'){
        TaskControllers.deleteTask(message)  
      }
    }catch(err){

}});
     
const app = express();
app.use(cors());
app.use(express.json());

app.post('/fetchAllTasks', TaskControllers.fetchAllTasks)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
