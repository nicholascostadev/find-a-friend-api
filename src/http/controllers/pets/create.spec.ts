import { app } from "@/app";
import { createOrganizationAndAuthenticate } from "@/http/tests/utils/createOrganizationAndAuthenticate";
import {
	type Organization,
	PetAge,
	PetEnergy,
	PetIndependence,
	PetSize,
} from "@prisma/client";
import request from "supertest";

describe("Create Pet (e2e)", () => {
	let token: string;

	beforeAll(async () => {
		await app.ready();

		const { token: localToken } = await createOrganizationAndAuthenticate();

		token = localToken;
	});

	afterAll(async () => {
		await app.close();
	});

	it("should be able to create a pet", async () => {
		const response = await request(app.server)
			.post("/pets")
			.send({
				name: "John Doe",
				city: "São Paulo",
				age: PetAge.PUPPY,
				energy: PetEnergy.LOW,
				size: PetSize.SMALL,
				independence: PetIndependence.LOW,
			})
			.set("Authorization", `Bearer ${token}`);

		expect(response.statusCode).toEqual(201);
	});

	it("should not be able to create a pet without authentication", async () => {
		const response = await request(app.server).post("/pets").send({
			name: "John Doe",
			city: "São Paulo",
		});

		expect(response.statusCode).toEqual(401);
	});

	it("should validate if name is missing", async () => {
		const response = await request(app.server)
			.post("/pets")
			.send({
				city: "São Paulo",
				age: "PUPPY",
				energy: "LOW",
				size: "SMALL",
				independence: "LOW",
			})
			.set("Authorization", `Bearer ${token}`);

		expect(response.statusCode).toEqual(400);
	});

	it("should validate if city is missing", async () => {
		const response = await request(app.server)
			.post("/pets")
			.send({
				name: "John Doe",
				age: PetAge.PUPPY,
				energy: PetEnergy.LOW,
				size: PetSize.SMALL,
				independence: PetIndependence.LOW,
			})
			.set("Authorization", `Bearer ${token}`);

		expect(response.statusCode).toEqual(400);
	});

	it("should validate if age is missing", async () => {
		const response = await request(app.server)
			.post("/pets")
			.send({
				name: "John Doe",
				city: "São Paulo",
				energy: PetEnergy.LOW,
				size: PetSize.SMALL,
				independence: PetIndependence.LOW,
			})
			.set("Authorization", `Bearer ${token}`);

		expect(response.statusCode).toEqual(400);
	});

	it("should validate if energy is missing", async () => {
		const response = await request(app.server)
			.post("/pets")
			.send({
				name: "John Doe",
				city: "São Paulo",
				age: PetAge.PUPPY,
				size: PetSize.SMALL,
				independence: PetIndependence.LOW,
			})
			.set("Authorization", `Bearer ${token}`);

		expect(response.statusCode).toEqual(400);
	});

	it("should validate if size is missing", async () => {
		const response = await request(app.server)
			.post("/pets")
			.send({
				name: "John Doe",
				city: "São Paulo",
				age: PetAge.PUPPY,
				energy: PetEnergy.LOW,
				independence: PetIndependence.LOW,
			})
			.set("Authorization", `Bearer ${token}`);

		expect(response.statusCode).toEqual(400);
	});

	it("should validate if independence is missing", async () => {
		const response = await request(app.server)
			.post("/pets")
			.send({
				name: "John Doe",
				city: "São Paulo",
				age: PetAge.PUPPY,
				energy: PetEnergy.LOW,
				size: PetSize.SMALL,
			})
			.set("Authorization", `Bearer ${token}`);

		expect(response.statusCode).toEqual(400);
	});

	it("should validate if age is valid", async () => {
		const response = await request(app.server)
			.post("/pets")
			.send({
				name: "John Doe",
				city: "São Paulo",
				age: "INVALID_AGE",
				energy: PetEnergy.LOW,
				size: PetSize.SMALL,
				independence: PetIndependence.LOW,
			})
			.set("Authorization", `Bearer ${token}`);

		expect(response.statusCode).toEqual(400);
	});

	it("should validate if energy is valid", async () => {
		const response = await request(app.server)
			.post("/pets")
			.send({
				name: "John Doe",
				city: "São Paulo",
				age: PetAge.PUPPY,
				energy: "INVALID_ENERGY",
				size: PetSize.SMALL,
				independence: PetIndependence.LOW,
			})
			.set("Authorization", `Bearer ${token}`);

		expect(response.statusCode).toEqual(400);
	});

	it("should validate if size is valid", async () => {
		const response = await request(app.server)
			.post("/pets")
			.send({
				name: "John Doe",
				city: "São Paulo",
				age: PetAge.PUPPY,
				energy: PetEnergy.LOW,
				size: "INVALID_SIZE",
				independence: PetIndependence.LOW,
			})
			.set("Authorization", `Bearer ${token}`);

		expect(response.statusCode).toEqual(400);
	});

	it("should validate if independence is valid", async () => {
		const response = await request(app.server)
			.post("/pets")
			.send({
				name: "John Doe",
				city: "São Paulo",
				age: PetAge.PUPPY,
				energy: PetEnergy.LOW,
				size: PetSize.SMALL,
				independence: "INVALID_INDEPENDENCE",
			})
			.set("Authorization", `Bearer ${token}`);

		expect(response.statusCode).toEqual(400);
	});
});
