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
			password: "Password1!",
			address: "123 Main St",
			whatsapp: "12345678901",
			zipCode: "12345678",
		});

		expect(response.statusCode).toEqual(201);
	});

	it("should not be able to create an organization with an invalid email", async () => {
		const response = await request(app.server).post("/organization").send({
			name: "John Doe",
			email: "invalid-email",
			password: "Password1!",
			address: "123 Main St",
			whatsapp: "12345678901",
			zipCode: "12345678",
		});

		expect(response.statusCode).toEqual(400);
	});

	it("should not be able to create an organization with a name less than 3 characters", async () => {
		const response = await request(app.server).post("/organization").send({
			name: "Jo",
			email: "john.doe@example.com",
			password: "Password1!",
			address: "123 Main St",
			whatsapp: "12345678901",
			zipCode: "12345678",
		});

		expect(response.statusCode).toEqual(400);
	});

	it("should not be able to create an organization with an invalid whatsapp number", async () => {
		const response = await request(app.server).post("/organization").send({
			name: "John Doe",
			email: "john.doe@example.com",
			password: "Password1!",
			address: "123 Main St",
			whatsapp: "123",
			zipCode: "12345678",
		});

		expect(response.statusCode).toEqual(400);
	});

	it("should not be able to create an organization with an invalid CEP", async () => {
		const response = await request(app.server).post("/organization").send({
			name: "John Doe",
			email: "john.doe@example.com",
			password: "Password1!",
			address: "123 Main St",
			whatsapp: "12345678901",
			zipCode: "123",
		});

		expect(response.statusCode).toEqual(400);
	});

	it("should not be able to create an organization with a password that is too short", async () => {
		const response = await request(app.server).post("/organization").send({
			name: "John Doe",
			email: "john.doe@example.com",
			password: "Abc1!",
			address: "123 Main St",
			whatsapp: "12345678901",
			zipCode: "12345678",
		});

		expect(response.statusCode).toEqual(400);
	});

	it("should not be able to create an organization with a password missing uppercase", async () => {
		const response = await request(app.server).post("/organization").send({
			name: "John Doe",
			email: "john.doe@example.com",
			password: "password1!",
			address: "123 Main St",
			whatsapp: "12345678901",
			zipCode: "12345678",
		});

		expect(response.statusCode).toEqual(400);
	});

	it("should not be able to create an organization with a password missing special character", async () => {
		const response = await request(app.server).post("/organization").send({
			name: "John Doe",
			email: "john.doe@example.com",
			password: "Password1",
			address: "123 Main St",
			whatsapp: "12345678901",
			zipCode: "12345678",
		});

		expect(response.statusCode).toEqual(400);
	});
});
