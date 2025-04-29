import { app } from "@/app";
import { createOrganizationAndAuthenticate } from "@/http/tests/utils/createOrganizationAndAuthenticate";
import { PetAge, PetEnergy, PetIndependence, PetSize } from "@prisma/client";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Update Pet Adoptment State (e2e)", () => {
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

	it("should be able to mark a pet as adopted", async () => {
		const response = await request(app.server)
			.put(`/pets/${petId}/adoptment-state`)
			.set("Authorization", `Bearer ${token}`)
			.send({ adopted: true });

		expect(response.statusCode).toEqual(204);

		// Verify the pet is now marked as adopted
		const petResponse = await request(app.server)
			.get(`/pets/${petId}`)
			.set("Authorization", `Bearer ${token}`)
			.send();

		expect(petResponse.statusCode).toEqual(200);
		expect(petResponse.body.pet.adopted_at).not.toBeNull();
	});

	it("should be able to mark an adopted pet as not adopted", async () => {
		// First mark as adopted
		await request(app.server)
			.put(`/pets/${petId}/adoptment-state`)
			.set("Authorization", `Bearer ${token}`)
			.send({ adopted: true });

		// Then mark as not adopted
		const response = await request(app.server)
			.put(`/pets/${petId}/adoptment-state`)
			.set("Authorization", `Bearer ${token}`)
			.send({ adopted: false });

		expect(response.statusCode).toEqual(204);

		// Verify the pet is now marked as not adopted
		const petResponse = await request(app.server)
			.get(`/pets/${petId}`)
			.set("Authorization", `Bearer ${token}`)
			.send();

		expect(petResponse.statusCode).toEqual(200);
		expect(petResponse.body.pet.adopted_at).toBeNull();
	});

	it("should not be able to update adoptment state without authentication", async () => {
		const response = await request(app.server)
			.put(`/pets/${petId}/adoptment-state`)
			.send({ adopted: true });

		expect(response.statusCode).toEqual(401);
	});

	it("should not be able to update adoptment state of non-existent pet", async () => {
		const response = await request(app.server)
			.put("/pets/non-existent-id/adoptment-state")
			.set("Authorization", `Bearer ${token}`)
			.send({ adopted: true });

		expect(response.statusCode).toEqual(404);
	});

	it("should not be able to update adoptment state of a pet from another organization", async () => {
		const anotherAuthResponse = await createOrganizationAndAuthenticate({
			email: "another.john.doe@example.com",
			password: "123456",
		});
		const anotherToken = anotherAuthResponse.token;

		const response = await request(app.server)
			.put(`/pets/${petId}/adoptment-state`)
			.set("Authorization", `Bearer ${anotherToken}`)
			.send({ adopted: true });

		expect(response.statusCode).toEqual(401);
	});

	it("should validate request body", async () => {
		const response = await request(app.server)
			.put(`/pets/${petId}/adoptment-state`)
			.set("Authorization", `Bearer ${token}`)
			.send({
				/* missing adopted field */
			});

		expect(response.statusCode).toEqual(400);
	});
});
