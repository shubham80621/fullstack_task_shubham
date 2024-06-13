import Tasks, {ITask} from '../../Models/Task';
import * as redis from 'redis';
import { promisify } from 'util';

const redisClient = redis.createClient({ url: process.env.REDIS_URL });
redisClient.on('error', (err: Error) => console.error('Redis Client Error', err));
redisClient.connect();

const lpushAsync = promisify(redisClient.LPUSH).bind(redisClient);
const redisKey: string = process.env.REDIS_MY_VAR!;

const addTask = async (message: string) => {
  const newMessage = message.toString();
  const newItem = { name: newMessage, time: new Date() };

  try {
    const response = await redisClient.LPUSH(redisKey, JSON.stringify(newItem)); 

    if (response) {
      await checkRedisCountAndMoveToMongo();
    } else {
      throw new Error("Error adding the item in Redis");
    }
  } catch (error) {
    console.error("Error adding task:", error);
    throw error;
  }
};

const deleteTask = (messsage: string) => {
  // Implement deletion logic based on req parameters
};

const fetchAllTasks = async (req: any, res: any) => {
    try {
      const tasksFromMongo: ITask[] = await Tasks.find().sort({ time: -1 });
      
      if (!tasksFromMongo) {
        return res.status(404).send('No tasks found');
      }
  
      let cachedTasks = await checkRedisCountAndMoveToMongo();
  
      for (let i = cachedTasks.length - 1; i >= 0; i--) {
        const cachedTaskData = JSON.parse(cachedTasks[i]);
        const newTask: ITask = new Tasks({ name: cachedTaskData.name, time: new Date(cachedTaskData.time) }); // Create a new instance of Task model
        tasksFromMongo.unshift(newTask);
      }
  
      return res.status(200).json({ success: true, tasks: tasksFromMongo });
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return res.status(500).send('Server error');
    }
  };

async function checkRedisCountAndMoveToMongo() {
  try {
    const count = await redisClient.LLEN(redisKey) 

    if (count > 5) {
      let tasks = await redisClient.LRANGE(redisKey, 0, -1)
      tasks = tasks.map((task: string) => JSON.parse(task));

      const savedTasks = await Tasks.insertMany(tasks);
      await redisClient.DEL(redisKey); 

      return [];
    } else {
      return await redisClient.LRANGE(redisKey, 0, -1)
    }
  } catch (error) {
    console.error("Error checking Redis count and moving to MongoDB:", error);
    return [];
  }
}

export default { addTask, deleteTask, fetchAllTasks };
