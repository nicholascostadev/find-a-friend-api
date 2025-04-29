import { ResourceNotFoundException } from "@/exceptions/resource-not-found-exception";
import { InMemoryPetsRepository } from "@/repositories/in-memory/in-memory-pets-repository";
import { PetAge, PetEnergy, PetIndependence, PetSize } from "@prisma/client";
import { DetailsPetService } from "./details";

describe("Create Pet Service", () => {
	let petsRepository: InMemoryPetsRepository;
	let sut: DetailsPetService;

	beforeEach(() => {
		petsRepository = new InMemoryPetsRepository();
		sut = new DetailsPetService(petsRepository);
	});

	it("should be able to create an organization", async () => {
		const pet = await petsRepository.create({
			name: "John Doe",
			city: "São Paulo",
			age: PetAge.PUPPY,
			energy: PetEnergy.LOW,
			size: PetSize.SMALL,
			independence: PetIndependence.LOW,
			organizationId: "1",
		});

		const { pet: petDetails } = await sut.execute({
			id: pet.id,
		});

		expect(petDetails.id).toEqual(pet.id);
		expect(petDetails.name).toEqual(pet.name);
		expect(petDetails.city).toEqual(pet.city);
		expect(petDetails.age).toEqual(pet.age);
		expect(petDetails.energy).toEqual(pet.energy);
		expect(petDetails.size).toEqual(pet.size);
		expect(petDetails.independence).toEqual(pet.independence);
		expect(petDetails.organizationId).toEqual(pet.organizationId);
	});

	it("should not be able to get a pet by id if it does not exist", async () => {
		await expect(
			sut.execute({
				id: "non-existent-pet-id",
			}),
		).rejects.toThrow(ResourceNotFoundException);
	});
});
