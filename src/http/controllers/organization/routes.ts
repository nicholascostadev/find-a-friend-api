import { ExceptionSchema } from "@/exceptions/exception";
import { OrganizationSchema } from "@/http/models/organization";
import type { FastifyInstance } from "fastify";
import {
	authenticateOrganizationBodySchema,
	authenticateOrganizationController,
} from "./authenticate";
import {
	createOrganizationBodySchema,
	createOrganizationController,
} from "./create";

export async function organizationRoutes(app: FastifyInstance) {
	app.withTypeProvider().route({
		method: "POST",
		url: "/organization",
		schema: {
			body: createOrganizationBodySchema,
			response: {
				201: OrganizationSchema,
				401: ExceptionSchema.describe("Unauthorized"),
			},
		},
		handler: createOrganizationController,
	});
	app.withTypeProvider().route({
		method: "POST",
		url: "/organization/authenticate",
		schema: {
			body: authenticateOrganizationBodySchema,
			response: {
				200: OrganizationSchema,
				401: ExceptionSchema.describe("Unauthorized"),
			},
		},
		handler: authenticateOrganizationController,
	});
}
