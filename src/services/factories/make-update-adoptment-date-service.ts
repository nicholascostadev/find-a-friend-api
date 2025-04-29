import { PrismaPetsRepository } from "@/repositories/prisma/prisma-pets-repository";
import { UpdateAdoptmentDateService } from "../pets/update-adoptment-date";

export function makeUpdateAdoptmentDateService() {
	const petsRepository = new PrismaPetsRepository();

	const updateAdoptmentDateService = new UpdateAdoptmentDateService(
		petsRepository,
	);

	return updateAdoptmentDateService;
}
