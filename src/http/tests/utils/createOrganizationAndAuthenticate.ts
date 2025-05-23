import { app } from "@/app";
import { db } from "@/lib/infra/database";
import { hash } from "bcryptjs";
import request from "supertest";

export async function createOrganizationAndAuthenticate(params?: {
	email?: string;
	password?: string;
}) {
	const { email = "john.doe@example.com", password = "123456" } = params ?? {};
	const passwordHash = await hash(password, 6);

	const organization = await db.organization.create({
		data: {
			name: "John Doe",
			email,
			password_hash: passwordHash,
			address: "123 Main St",
			whatsapp: "1234567890",
			zip_code: "1234567890",
		},
	});

	const authResponse = await request(app.server)
		.post("/organization/authenticate")
		.send({
			email,
			password,
		});

	const { token } = authResponse.body;

	return { organization, token };
}
