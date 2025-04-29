import { ResourceNotFoundException } from "@/exceptions/resource-not-found-exception";
import type { OrganizationsRepository } from "@/repositories/organizations-repository";
import type { PetsRepository } from "@/repositories/pets-repository";
import type {
	Pet,
	PetAge,
	PetEnergy,
	PetIndependence,
	PetSize,
} from "@prisma/client";

interface CreatePetServiceRequest {
	name: string;
	city: string;
	age: PetAge;
	energy: PetEnergy;
	size: PetSize;
	independence: PetIndependence;
	organizationId: string;
}

interface CreatePetServiceResponse {
	pet: Pet;
}

export class CreatePetService {
	constructor(
		private organizationsRepository: OrganizationsRepository,
		private petsRepository: PetsRepository,
	) {}

	async execute(
		data: CreatePetServiceRequest,
	): Promise<CreatePetServiceResponse> {
		const organization = await this.organizationsRepository.findById(
			data.organizationId,
		);

		if (!organization) {
			throw new ResourceNotFoundException("Organization");
		}

		const pet = await this.petsRepository.create(data);

		return {
			pet,
		};
	}
}
