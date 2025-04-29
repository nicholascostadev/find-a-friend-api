import { app } from "@/app";
import { createOrganizationAndAuthenticate } from "@/http/tests/utils/createOrganizationAndAuthenticate";
import { PetAge, PetEnergy, PetIndependence, PetSize } from "@prisma/client";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("List Pets (e2e)", () => {
	let token: string;

	beforeAll(async () => {
		await app.ready();

		const authResponse = await createOrganizationAndAuthenticate();
		token = authResponse.token;

		// Create pets for testing using the API
		await request(app.server)
			.post("/pets")
			.set("Authorization", `Bearer ${token}`)
			.send({
				name: "Rex",
				city: "São Paulo",
				age: PetAge.PUPPY,
				energy: PetEnergy.HIGH,
				size: PetSize.MEDIUM,
				independence: PetIndependence.LOW,
			});

		await request(app.server)
			.post("/pets")
			.set("Authorization", `Bearer ${token}`)
			.send({
				name: "Bella",
				city: "São Paulo",
				age: PetAge.ADULT,
				energy: PetEnergy.LOW,
				size: PetSize.SMALL,
				independence: PetIndependence.HIGH,
			});

		await request(app.server)
			.post("/pets")
			.set("Authorization", `Bearer ${token}`)
			.send({
				name: "Max",
				city: "Rio de Janeiro",
				age: PetAge.PUPPY,
				energy: PetEnergy.LOW,
				size: PetSize.SMALL,
				independence: PetIndependence.LOW,
			});
	});

	afterAll(async () => {
		await app.close();
	});

	it("should be able to list pets by filters", async () => {
		const response = await request(app.server)
			.get("/pets")
			.query({
				city: "São Paulo",
				age: PetAge.PUPPY,
				energy: PetEnergy.HIGH,
				size: PetSize.MEDIUM,
				independence: PetIndependence.LOW,
			})
			.set("Authorization", `Bearer ${token}`)
			.send();

		expect(response.statusCode).toEqual(200);
		expect(response.body.pets).toHaveLength(1);
		expect(response.body.pets[0].name).toEqual("Rex");
	});

	it("should be able to filter pets by city only", async () => {
		const response = await request(app.server)
			.get("/pets")
			.query({
				city: "São Paulo",
			})
			.set("Authorization", `Bearer ${token}`)
			.send();

		expect(response.statusCode).toEqual(200);
		expect(response.body.pets).toHaveLength(2);
		expect(response.body.pets).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ name: "Rex" }),
				expect.objectContaining({ name: "Bella" }),
			]),
		);
	});

	it("should return an empty array when no pets match the filters", async () => {
		const response = await request(app.server)
			.get("/pets")
			.query({
				city: "Brasília", // City with no pets
				age: PetAge.SENIOR,
				energy: PetEnergy.MEDIUM,
				size: PetSize.LARGE,
				independence: PetIndependence.MEDIUM,
			})
			.set("Authorization", `Bearer ${token}`)
			.send();

		expect(response.statusCode).toEqual(200);
		expect(response.body.pets).toHaveLength(0);
	});

	it("should validate the query parameters", async () => {
		const response = await request(app.server)
			.get("/pets")
			.query({
				city: "São Paulo",
				age: "INVALID_AGE", // Invalid enum value
			})
			.set("Authorization", `Bearer ${token}`)
			.send();

		expect(response.statusCode).toEqual(400);
	});
});
