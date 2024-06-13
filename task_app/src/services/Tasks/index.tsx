import React from 'react';

import mqtt from 'mqtt';

const client = mqtt.connect(`${process.env.REACT_APP_MQTT_URL}`); 

client.on('connect', () => {
  console.log('Connected to MQTT broker');
});

const fetchAllTasks = async () => {
    try {
        const ApiUrl = `${process.env.REACT_APP_BASE_URL}/fetchAlltasks`
        let response = await fetch(ApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        return await response.json();
    } catch (error) {
        console.error(error); 
        throw error;
    }
} 

const publishData = async(topic : string, data: string)=>{
    try{
        if (!client.connected) {
            console.error('Client is not connected');
            return false;
        }
        console.log("publishing, topic: " + topic + ", data: " + data);
        client.publish(topic, data)
        return true
    }catch(error){
        console.error(error);
        return false
    }
}

export default {
    fetchAllTasks,
    publishData
}