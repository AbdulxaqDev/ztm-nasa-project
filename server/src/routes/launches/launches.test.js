const request = require("supertest");
const app = require("../../app.js");
const { 
  mongoConnect,
  mongoDisconnect,
} = require("../../services/mongo.js");
const { loadPlanetsData } = require("../../models/planets.model.js");

describe("Launches API", () => {

  beforeAll(async () => {
    await mongoConnect();
    await loadPlanetsData();
  });

  afterAll(async () => {
    await mongoDisconnect();
  });

  describe("Test GET /launches", () => {
    test("It should respond with 200 success.", async () => {
      const response = await request(app)
        .get("/v1/launches")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  describe("Test POST /launches", () => {
    const completeLaunchData = {
      mission: "USS Interorise",
      rocket: "NCC 1701-D",
      target: "Kepler-442 b",
      launchDate: "January 4, 2028",
    };

    const launchDataWithoutDate = {
      mission: "USS Interorise",
      rocket: "NCC 1701-D",
      target: "Kepler-442 b",
    };

    const launchDataWithInvalidDate = {
      mission: "USS Interorise",
      rocket: "NCC 1701-D",
      target: "Kepler-442 b",
      launchDate: "Invalid date",
    };

    test("It shoudl respond with 201 created", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(completeLaunchData)
        .expect("Content-Type", /json/)
        .expect(201);

      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();
      expect(responseDate).toBe(requestDate);

      expect(response.body).toMatchObject(launchDataWithoutDate);
    });

    test("It shoud catch missing requires properties", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchDataWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Missing required launch property",
      });
    });
    test("It shoudl catch invalid dates", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchDataWithInvalidDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Invalid launch date",
      });
    });
  });
});
