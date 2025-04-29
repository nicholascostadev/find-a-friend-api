import type { PetsRepository } from "@/repositories/pets-repository";
import type { Pet, PetEnergy, PetIndependence, PetSize } from "@prisma/client";

interface ListPetsServiceRequest {
	city: string;
	petSize?: PetSize;
	petEnergy?: PetEnergy;
	petIndependence?: PetIndependence;
}

interface ListPetsServiceResponse {
	pets: Pet[];
}

export class ListPetsService {
	constructor(private petsRepository: PetsRepository) {}

	async execute(data: ListPetsServiceRequest) {
		const pets = await this.petsRepository.findManyByFilters(data);

		return {
			pets,
		};
	}
}
