import { app } from "@/app";
import { db } from "@/lib/infra/database";
import { hash } from "bcryptjs";
import request from "supertest";

describe("Authenticate Organization (e2e)", () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it("should be able to authenticate an organization", async () => {
		const password = "123456";
		const passwordHash = await hash(password, 6);

		await db.organization.create({
			data: {
				name: "John Doe",
				email: "john.doe@example.com",
				password_hash: passwordHash,
				address: "123 Main St",
				whatsapp: "1234567890",
				zip_code: "1234567890",
			},
		});

		const response = await request(app.server)
			.post("/organization/authenticate")
			.send({
				email: "john.doe@example.com",
				password,
			});

		expect(response.statusCode).toEqual(200);
		expect(response.body).toEqual({
			token: expect.any(String),
		});
	});

	it("should not be able to authenticate an organization with an invalid email", async () => {
		const response = await request(app.server)
			.post("/organization/authenticate")
			.send({
				email: "invalid-email",
				password: "123456",
			});

		expect(response.statusCode).toEqual(400);
	});
});
