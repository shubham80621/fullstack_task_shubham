import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ITask extends Document {
  name: string;
  time: Date;
}

const taskSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    time: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Task: Model<ITask> = mongoose.model<ITask>('assignment_shubham', taskSchema);

export default Task;
