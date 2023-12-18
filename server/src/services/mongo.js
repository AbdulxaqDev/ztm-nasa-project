const mongoose = require("mongoose");

require('dotenv').config();

const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once("open", () => {
  console.log("MongoDB connection is ready!");
});

mongoose.connection.on("error", (error) => {
  console.error("Error", error);
});

async function mongoConnect(){
  await mongoose.connect(MONGO_URL); 
}

async function mongoDisconnect(){
  await mongoose.disconnect();
}

module.exports = {
  mongoConnect,
  mongoDisconnect,
}
