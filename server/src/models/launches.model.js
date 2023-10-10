const launches = new Map();

const launch = {
  flightNumber: 100,
  mission: "Mission Exploration XX",
  rocket: "Explore IS1",
  launchDate: new Date("December 27, 2023"),
  target: "Kepler-442 b",
  customers: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};

launches.set(launch.flightNumber, launch);

module.exports = {
  launches,
};
