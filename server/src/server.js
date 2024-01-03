const http = require("http");

require("dotenv").config();

const app = require("./app.js");
const { mongoConnect } = require("./services/mongo.js");
const { loadPlanetsData } = require("./models/planets.model.js");
const { loadLaunchesData } = require("./models/launches.model.js");

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
  await mongoConnect(); 
  await loadPlanetsData();
  await loadLaunchesData();
  server.listen(PORT, () => {
    console.log("Server is running on port:", PORT);
  });
}

startServer();
