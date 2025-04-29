import { PrismaPetsRepository } from "@/repositories/prisma/prisma-pets-repository";
import { DetailsPetService } from "../pets/details";

export function makeDetailsPetService() {
	const petsRepository = new PrismaPetsRepository();

	const detailsPetService = new DetailsPetService(petsRepository);

	return detailsPetService;
}
