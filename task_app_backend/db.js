function connectDb(MONGO_URI){
  const mongoose = require('mongoose');
  mongoose.connect(MONGO_URI);

  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  db.once('open', () => {
    console.log('⭐⭐⭐⭐Connected to MongoDB⭐⭐⭐⭐');
});
}

module.exports = {
  connectDb
};