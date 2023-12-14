const axios = require("axios");
const launchesDatabase = require("./launches.mongo.js");
const planets = require("./planets.mongo.js");
const { restart } = require("pm2");

const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
  flightNumber: 100, // flight_number
  mission: "Mission Exploration XX", // name 
  rocket: "Explore IS1", // rocket.name
  launchDate: new Date("December 27, 2023"), // data_local
  target: "Kepler-1652 b", // not applicable
  customers: ["ZTM", "NASA"], // payload.customers for each payload
  upcoming: true, // upcoming
  success: true, // success
};

saveLaunch(launch);

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query"

async function populateLaunches(){
  console.log("Downloading lounches data...");
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1, 
          }
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          }
        }
      ]
    } 
  }); 

  const launchDocs = response.data.docs;
  for(const launchDoc of launchDocs){

    const payloads = launchDoc["payloads"];

    const customers = payloads.flatMap((payload) => {
      return payload.customers;
    });

    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      launchDate: launchDoc["date_local"],
      upcoming: launchDoc["upcoming"],
      success: launchDoc["success"],
      customers,
    }

    saveLaunch(launch); 
  }
}

async function loadLaunchesData(){
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });
  
  if(firstLaunch){
    console.log("Launches data already loaded");
    return;
  }else{
    await populateLaunches();
  }
}

async function findLaunch(filter){
  return launchesDatabase.findOne(filter);
}

async function existsLaunchWithId(launchId){
  return await findLaunch({
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
  await launchesDatabase.findOneAndUpdate(
    {flightNumber: launch.flightNumber}, 
    launch, 
    {upsert: true}
  )
}

async function scheduleNewLaunch(launch){

  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if(!planet){
    throw new Error("No matching planet found");
  }

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
  loadLaunchesData,
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchWithId,
  abortedLauchById, 
};
