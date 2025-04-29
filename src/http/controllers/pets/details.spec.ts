import { app } from "@/app";
import { createOrganizationAndAuthenticate } from "@/http/tests/utils/createOrganizationAndAuthenticate";
import { PetAge, PetEnergy, PetIndependence, PetSize } from "@prisma/client";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Details Pet (e2e)", () => {
	let token: string;
	let petId: string;

	beforeAll(async () => {
		await app.ready();

		const authResponse = await createOrganizationAndAuthenticate();
		token = authResponse.token;

		// Create a pet for testing
		const createResponse = await request(app.server)
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

		petId = createResponse.body.pet.id;
	});

	afterAll(async () => {
		await app.close();
	});

	it("should be able to get pet details", async () => {
		const response = await request(app.server)
			.get(`/pets/${petId}`)
			.set("Authorization", `Bearer ${token}`)
			.send();

		expect(response.statusCode).toEqual(200);
		expect(response.body.pet).toEqual(
			expect.objectContaining({
				id: petId,
				name: "Rex",
				city: "São Paulo",
				age: PetAge.PUPPY,
				energy: PetEnergy.HIGH,
				size: PetSize.MEDIUM,
				independence: PetIndependence.LOW,
			}),
		);
	});

	it("should return 404 when trying to get details of non-existent pet", async () => {
		const response = await request(app.server)
			.get("/pets/non-existent-id")
			.set("Authorization", `Bearer ${token}`)
			.send();

		expect(response.statusCode).toEqual(404);
	});

	it("should validate the pet id parameter", async () => {
		const response = await request(app.server)
			.get("/pets/")
			.set("Authorization", `Bearer ${token}`)
			.send();

		expect(response.statusCode).toEqual(404);
	});
});
