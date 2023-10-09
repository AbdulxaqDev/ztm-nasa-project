const http = require("http");
const app = require("./app.js");
const { loadPlanetsData } = require("./models/planets.model.js");

const server = http.createServer(app);

const PORT = process.env.PORT || 8000;

async function startServer() {
  await loadPlanetsData();

  server.listen(PORT, () => {
    console.log("Server is running on port", PORT);
  });
}

startServer();
