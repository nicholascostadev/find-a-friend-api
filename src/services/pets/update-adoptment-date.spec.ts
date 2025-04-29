import { ResourceNotFoundException } from "@/exceptions/resource-not-found-exception";
import { UnauthorizedException } from "@/exceptions/unauthorized-exception";
import { InMemoryPetsRepository } from "@/repositories/in-memory/in-memory-pets-repository";
import { UpdateAdoptmentDateService } from "./update-adoptment-date";

describe("Update Adoptment Date Service", () => {
	let petsRepository: InMemoryPetsRepository;
	let sut: UpdateAdoptmentDateService;

	beforeEach(() => {
		petsRepository = new InMemoryPetsRepository();
		sut = new UpdateAdoptmentDateService(petsRepository);
	});

	it("should be able to update a pet's adoptment date", async () => {
		const pet = await petsRepository.create({
			name: "Rex",
			city: "São Paulo",
			age: "ADULT",
			energy: "HIGH",
			size: "MEDIUM",
			independence: "MEDIUM",
			organizationId: "org-01",
		});

		const adoptedAt = new Date().toISOString();

		const { pet: updatedPet } = await sut.execute({
			petId: pet.id,
			organizationId: "org-01",
			adoptedAt,
		});

		expect(updatedPet.adopted_at).toEqual(expect.any(Date));
		expect(petsRepository.items[0].adopted_at).toEqual(expect.any(Date));
	});

	it("should be able to set adoptment date to null", async () => {
		const pet = await petsRepository.create({
			name: "Rex",
			city: "São Paulo",
			age: "ADULT",
			energy: "HIGH",
			size: "MEDIUM",
			independence: "MEDIUM",
			organizationId: "org-01",
			adopted_at: new Date(),
		});

		const { pet: updatedPet } = await sut.execute({
			petId: pet.id,
			organizationId: "org-01",
			adoptedAt: null,
		});

		expect(updatedPet.adopted_at).toBeNull();
		expect(petsRepository.items[0].adopted_at).toBeNull();
	});

	it("should not be able to update adoptment date of non-existent pet", async () => {
		await expect(() =>
			sut.execute({
				petId: "non-existent-pet-id",
				organizationId: "org-01",
				adoptedAt: new Date().toISOString(),
			}),
		).rejects.toThrow(ResourceNotFoundException);
	});

	it("should not be able to update adoptment date if organization is not the owner", async () => {
		const pet = await petsRepository.create({
			name: "Rex",
			city: "São Paulo",
			age: "ADULT",
			energy: "HIGH",
			size: "MEDIUM",
			independence: "MEDIUM",
			organizationId: "org-01",
		});

		await expect(() =>
			sut.execute({
				petId: pet.id,
				organizationId: "different-org-id",
				adoptedAt: new Date().toISOString(),
			}),
		).rejects.toThrow(UnauthorizedException);
	});
});
