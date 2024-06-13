import React from 'react';
import {useState, useEffect} from 'react'
import { motion } from "framer-motion"
import TaskServices from '../../services/Tasks'
import Button from '../../components/Button';
import Note from '../../components/Note';

const TaskPage =()=>{
    const [newTask, setNewTask] =useState("");
    const [allTasks, setAllTasks] = useState<{ name: string }[]>([]);
    useEffect(()=>{
       fetchAlltasks()
    },[])

    const fetchAlltasks= async()=>{
        try{
        const response = await TaskServices.fetchAllTasks()
        if(response.success){
            setAllTasks(response.tasks)
        }}
        catch(error){
            console.error(error)
        }
    }

    const handleAddTask=async()=>{
        if(newTask==="" || !newTask){
            alert("Please enter task")
            return
        }
        try {
            const published = await TaskServices.publishData('/add', newTask);
            if (published) {
                const updatedAllTasks = [...allTasks];
                updatedAllTasks.unshift({ name: newTask });
                setAllTasks(updatedAllTasks);
                setNewTask("");
            }
        } catch (error) {
            console.error(error);
        }
    }

    const removeTask=(task:any)=>{}

    return(<motion.div  initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                            duration: 0.8,
                            delay: 0.5,
                            ease: [0, 0.71, 0.2, 1.01]}}
                        className='h-screen w-screen sm:w-1/2 sm:h-2/3 d-flex flex flex-col gap-5 p-5 overflow-hidden border shadow sm:rounded-xl'>
                <div className='flex gap-2 items-center'>
                    <motion.div  animate={{ rotate:[0,360,0,360], 
                        scale: [2,1,2,1], 
                        x: [0,100,0,100,0], 
                        y: [0,100,0,100,0] }} transition={{ duration: 2 }}>
                    <img src='https://i.pinimg.com/originals/b6/cd/e8/b6cde81d1c489b0e20d85a6e06c5f8f9.png' className='h-10'/>
                    </motion.div>
                    
                   <span className='text-xl font-semibold'>
                      Note App
                   </span> 
                </div>
                <div className='flex gap-2 '>
                    <input className='grow p-1 border rounded-md shadow' 
                      type="text" value={newTask} placeholder='New notes...'
                      onChange={(e)=>setNewTask(e.target.value)}/>
                    <Button value="Add" onClick={handleAddTask}/>
                </div>
                <div className='grow overflow-hidden flex flex-col'>
                    <div className='border-b  p-2 text-start font-bold'>
                        Notes:
                    </div>
                    <div className='grow overflow-scroll scroll-ts-6 snap-x snap-mandatory text-slate-600'>
                      {allTasks.map((task, index) => <Note key={index} value={task.name} />)}
                    </div>
                </div>
          </motion.div>)


}


export default TaskPage