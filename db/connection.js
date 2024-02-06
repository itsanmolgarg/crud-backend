// db/connection.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;

async function connectToDatabase() {
  try {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    await mongoose.connect(uri);

    console.log('Connected to MongoDB in memory');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

async function disconnectFromDatabase() {
  await mongoose.disconnect();
  if (mongod) {
    await mongod.stop();
  }
}

module.exports = { connectToDatabase, disconnectFromDatabase };
