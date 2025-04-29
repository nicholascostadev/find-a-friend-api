import { app } from "@/app";
import request from "supertest";

describe("Create Organization (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to create an organization", async () => {
    const response = await request(app.server).post("/organization").send({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "123456",
      address: "123 Main St",
      whatsapp: "1234567890",
      zipCode: "1234567890",
    });

    expect(response.statusCode).toEqual(201);
  });

  it("should not be able to create an organization with an invalid email", async () => {
    const response = await request(app.server).post("/organization").send({
      name: "John Doe",
      email: "invalid-email",
      password: "123456",
      address: "123 Main St",
      whatsapp: "1234567890",
      zipCode: "1234567890",
    });

    expect(response.statusCode).toEqual(400);
  });
});