import { PrismaOrganizationsRepository } from "@/repositories/prisma/prisma-organizations-repository";
import { OrganizationAuthenticateService } from "../organizations/authenticate";

export function makeAuthenticateOrganizationService() {
	const organizationsRepository = new PrismaOrganizationsRepository();
	const organizationAuthenticateService = new OrganizationAuthenticateService(
		organizationsRepository,
	);

	return organizationAuthenticateService;
}
