import { PrismaOrganizationsRepository } from "@/repositories/prisma/prisma-organizations-repository";
import { CreateOrganizationService } from "../organizations/create";

export function makeCreateOrganizationService() {
	const organizationsRepository = new PrismaOrganizationsRepository();

	return new CreateOrganizationService(organizationsRepository);
}
