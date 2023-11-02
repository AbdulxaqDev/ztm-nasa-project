const request = require("supertest");
const app = require("../../app.js");

describe("Test GET /launches", () => {
    test("It should respond with 200 success.", async () => {
        const response = await request(app)
            .get("/launches")
            .expect("Content-Type", /json/)
            .expect(200);

    })
})

describe("Test POST /launches", () => {
    test("It shoudl respond with 201 created", async () => {
        const response = await request(app)
            .post("/launches")
            .send({
                mission: "USS Interorise",
                rocket: "NCC 1701-D",
                target: "Kepler 186-f",
                launchDate: "January 4, 2028",
            })
            .expect("Content-Type", /json/)
            .expect(201);

    })
    test("It shoud catch missing requires properties", () => {

    })
    test("It shoudl catch invalid dates", () => {

    })

})
