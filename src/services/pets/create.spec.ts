import { ResourceNotFoundException } from "@/exceptions/resource-not-found-exception";
import { InMemoryOrganizationsRepository } from "@/repositories/in-memory/in-memory-organizations-repository";
import { InMemoryPetsRepository } from "@/repositories/in-memory/in-memory-pets-repository";
import { PetAge, PetEnergy, PetIndependence, PetSize } from "@prisma/client";
import { CreatePetService } from "./create";

describe("Create Pet Service", () => {
	let petsRepository: InMemoryPetsRepository;
	let organizationsRepository: InMemoryOrganizationsRepository;
	let sut: CreatePetService;

	beforeEach(() => {
		petsRepository = new InMemoryPetsRepository();
		organizationsRepository = new InMemoryOrganizationsRepository();
		sut = new CreatePetService(organizationsRepository, petsRepository);
	});

	it("should be able to create an organization", async () => {
		const organization = await organizationsRepository.create({
			name: "John Doe",
			email: "john.doe@example.com",
			password_hash: "123456",
			address: "123 Main St",
			zip_code: "1234567890",
			whatsapp: "1234567890",
		});

		const { pet } = await sut.execute({
			name: "John Doe",
			city: "São Paulo",
			age: PetAge.PUPPY,
			energy: PetEnergy.LOW,
			size: PetSize.SMALL,
			independence: PetIndependence.LOW,
			organizationId: organization.id,
		});

		expect(pet.id).toEqual(expect.any(String));
		expect(petsRepository.items).toEqual([
			expect.objectContaining({ id: pet.id }),
		]);
	});

	it("should not be able to create a pet with a non-existent organization", async () => {
		await expect(
			sut.execute({
				name: "John Doe",
				city: "São Paulo",
				age: "PUPPY",
				energy: "LOW",
				size: "SMALL",
				independence: "LOW",
				organizationId: "non-existent-organization-id",
			}),
		).rejects.toThrow(ResourceNotFoundException);
	});
});
