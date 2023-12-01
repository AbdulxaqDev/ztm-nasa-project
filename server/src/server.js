const http = require("http");
const mongoose = require("mongoose");

const app = require("./app.js");

const { loadPlanetsData } = require("./models/planets.model.js");

const PORT = process.env.PORT || 8000;

const MONGO_URL = "mongodb+srv://omnimath:u96wnHORmX0zkLSY@nasa.m2i4sfz.mongodb.net/?retryWrites=true&w=majority"

const server = http.createServer(app);

mongoose.connection.once("open", () => {
  console.log("MongoDB connection is ready!");
});

mongoose.connection.on("error", (error) => {
  console.error("Error", error);
});

async function startServer() {
  await mongoose.connect(MONGO_URL); 
  await loadPlanetsData();

  server.listen(PORT, () => {
    console.log("Server is running on port", PORT);
  });
}

startServer();
