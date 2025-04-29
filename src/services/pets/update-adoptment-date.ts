import { ResourceNotFoundException } from "@/exceptions/resource-not-found-exception";
import { UnauthorizedException } from "@/exceptions/unauthorized-exception";
import type { PetsRepository } from "@/repositories/pets-repository";
import type { Pet } from "@prisma/client";

interface UpdateAdoptmentDateServiceRequest {
	petId: string;
	organizationId: string;
	adoptedAt: string | null;
}

interface UpdateAdoptmentDateServiceResponse {
	pet: Pet;
}

export class UpdateAdoptmentDateService {
	constructor(private petsRepository: PetsRepository) {}

	async execute(
		data: UpdateAdoptmentDateServiceRequest,
	): Promise<UpdateAdoptmentDateServiceResponse> {
		const pet = await this.petsRepository.findById(data.petId);

		if (!pet) {
			throw new ResourceNotFoundException("Pet not found");
		}

		if (pet.organizationId !== data.organizationId) {
			throw new UnauthorizedException();
		}

		const updatedPet = await this.petsRepository.updateAdoptmentDate(
			data.petId,
			data.adoptedAt ? new Date(data.adoptedAt) : null,
		);

		return {
			pet: updatedPet,
		};
	}
}
