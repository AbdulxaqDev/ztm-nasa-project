const launches = new Map();

let lastFlightNumber = 100;

const launch = {
    flightNumber: 100,
    mission: "Mission Exploration XX",
    rocket: "Explore IS1",
    launchDate: new Date("December 27, 2023"),
    target: "Kepler-442 b",
    customer: ["ZTM", "NASA"],
    upcoming: true,
    success: true,
};

launches.set(launch.flightNumber, launch);

function existsLaunchWithId(launchId){
    return launches.has(launchId);
}

function getAllLaunches() {
    return Array.from(launches.values());
}

function addNewLunch(launch) {
    ++lastFlightNumber;
    launches.set(
        lastFlightNumber,
        Object.assign(launch, {
            flightNumber: lastFlightNumber,
            customers: ["Zero to Mastery", "NASA"],
            success: true,
            upcoming: true,
        })
    );
}

function abortedLauchById(launchId){
    const aborted = launches.get(launchId);
    aborted.upcoming = false;
    aborted.success = false;
    return aborted;
}

module.exports = {
    getAllLaunches,
    addNewLunch,
    existsLaunchWithId,
    abortedLauchById,
};
