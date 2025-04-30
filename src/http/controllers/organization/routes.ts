import type { FastifyTypedInstance } from "@/@types/fasfify";
import {
	AuthenticateOrganizationBodySchema,
	AuthenticateResponseSchema,
	authenticateOrganizationController,
} from "./authenticate";
import {
	CreateOrganizationBodySchema,
	CreateOrganizationResponseSchema,
	createOrganizationController,
} from "./create";

export async function organizationRoutes(app: FastifyTypedInstance) {
	app.route({
		method: "POST",
		url: "/organization",
		schema: {
			tags: ["organization"],
			body: CreateOrganizationBodySchema,
			response: CreateOrganizationResponseSchema,
		},
		handler: createOrganizationController,
	});
	app.withTypeProvider().route({
		method: "POST",
		url: "/organization/authenticate",
		schema: {
			tags: ["organization"],
			body: AuthenticateOrganizationBodySchema,
			response: AuthenticateResponseSchema,
		},
		handler: authenticateOrganizationController,
	});
}
