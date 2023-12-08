const launchesDatabase = require("./launches.mongo.js");
const planets = require("./planets.mongo.js");

const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
  flightNumber: 100,
  mission: "Mission Exploration XX",
  rocket: "Explore IS1",
  launchDate: new Date("December 27, 2023"),
  target: "Kepler-1652 b",
  customers: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};

saveLaunch(launch);


async function existsLaunchWithId(launchId){
  return await launchesDatabase.findOne({
    flightNumber: launchId,
  });
}

async function getLatestLaunchNumber(){
  const latestLaunch = await launchesDatabase
    .findOne()
    .sort("-flightNumber");

  if(!latestLaunch){
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber;
}

async function getAllLaunches() {
  return await launchesDatabase
    .find({}, {"_id": 0, "__v": 0});
}

async function saveLaunch(launch){
  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if(!planet){
    throw new Error("No matching planet found");
  }

  await launchesDatabase.findOneAndUpdate(
    {flightNumber: launch.flightNumber}, 
    launch, 
    {upsert: true}
  )
}

async function scheduleNewLaunch(launch){
  const newFlightNumber = await getLatestLaunchNumber() + 1;

  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ["Zero to Mastery", "NASA"],
    flightNumber: newFlightNumber,
  })

  await saveLaunch(newLaunch);
}

async function abortedLauchById(launchId){
  const { acknowledged, modifiedCount, matchedCount  } = await launchesDatabase.updateOne({
    flightNumber: launchId,
  }, {
      success: false,
      upcoming: false,
  });

    return acknowledged && modifiedCount && matchedCount;
}

module.exports = {
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchWithId,
  abortedLauchById,
};
