const launchesDatabase = require("./launches.mongo.js");
const planets = require("./planets.mongo.js");

const launches = new Map();

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

launches.set(launch.flightNumber, launch);

function existsLaunchWithId(launchId){
  return launches.has(launchId);
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
  console.log("Find the target:", launch.target);
  console.log(planet);
  if(!planet){
    throw new Error("No matching planet found");
  }

  await launchesDatabase.updateOne(
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

function abortedLauchById(launchId){
  const aborted = launches.get(launchId);
  aborted.upcoming = false;
  aborted.success = false;
  return aborted;
}

module.exports = {
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchWithId,
  abortedLauchById,
};
