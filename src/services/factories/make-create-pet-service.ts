import { PrismaOrganizationsRepository } from "@/repositories/prisma/prisma-organizations-repository";
import { PrismaPetsRepository } from "@/repositories/prisma/prisma-pets-repository";
import { CreatePetService } from "../pets/create";

export function makeCreatePetService() {
	const petsRepository = new PrismaPetsRepository();
	const organizationsRepository = new PrismaOrganizationsRepository();
	const createPetService = new CreatePetService(
		organizationsRepository,
		petsRepository,
	);

	return createPetService;
}
