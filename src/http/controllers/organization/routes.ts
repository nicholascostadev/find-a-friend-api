import type { FastifyInstance } from "fastify";
import { authenticateOrganizationController } from "./authenticate";
import { createOrganizationController } from "./create";

export async function organizationRoutes(app: FastifyInstance) {
	app.post("/organization", createOrganizationController);
	app.post("/organization/authenticate", authenticateOrganizationController);
}
