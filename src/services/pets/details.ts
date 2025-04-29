import { ResourceNotFoundException } from "@/exceptions/resource-not-found-exception";
import type { PetsRepository } from "@/repositories/pets-repository";
import type { Pet } from "@prisma/client";

interface DetailsPetServiceRequest {
	id: string;
}

interface DetailsPetServiceResponse {
	pet: Pet;
}

export class DetailsPetService {
	constructor(private petsRepository: PetsRepository) {}

	async execute(data: DetailsPetServiceRequest): Promise<DetailsPetServiceResponse> {
		const pet = await this.petsRepository.findById(data.id);

		if (!pet) {
			throw new ResourceNotFoundException("Pet");
		}

		return {
			pet,
		};
	}
}
