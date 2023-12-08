const mongoose = require("mongoose");



const MONGO_URL = "mongodb+srv://omnimath:u96wnHORmX0zkLSY@nasa.m2i4sfz.mongodb.net/?retryWrites=true&w=majority"

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
