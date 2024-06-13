import mongoose from 'mongoose';

const connectDb = async (MONGO_URI: string): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('⭐⭐⭐⭐Connected to MongoDB⭐⭐⭐⭐');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit the process with failure
  }

  const db = mongoose.connection;
  db.on('error', (error) => console.error('MongoDB connection error:', error));
};

export default connectDb;
