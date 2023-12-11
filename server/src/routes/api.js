const express = require('express');

const api = express.Router();

const planetsRouter = require("./planets/planets.router.js");
const launchesRouter = require("./launches/launches.router.js");

api.use("/planets", planetsRouter);
api.use("/launches", launchesRouter);

module.exports = api;
