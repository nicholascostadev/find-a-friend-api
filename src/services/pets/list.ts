import type { PetsRepository } from "@/repositories/pets-repository";

export class ListPetsService {
	constructor(private petsRepository: PetsRepository) {}

	async execute() {
		const pets = await this.petsRepository.findMany();

		return {
			pets,
		};
	}
}
