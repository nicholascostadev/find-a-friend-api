import { InMemoryPetsRepository } from "@/repositories/in-memory/in-memory-pets-repository";
import { PetAge, PetEnergy, PetIndependence, PetSize } from "@prisma/client";
import { ListPetsService } from "./list";

describe("Create Pet Service", () => {
	let petsRepository: InMemoryPetsRepository;
	let sut: ListPetsService;

	beforeEach(() => {
		petsRepository = new InMemoryPetsRepository();
		sut = new ListPetsService(petsRepository);
	});

	it("should be able to list all pets by city when has only one pet", async () => {
		const pet = await petsRepository.create({
			name: "John Doe",
			city: "São Paulo",
			age: "PUPPY",
			energy: "LOW",
			size: "SMALL",
			independence: "LOW",
			organizationId: "1",
		});

		const { pets } = await sut.execute({
			city: "São Paulo",
		});

		expect(pets).toEqual([expect.objectContaining({ id: pet.id })]);
	});

	it("should be able to list all pets by city when has more than one pet", async () => {
		const pet = await petsRepository.create({
			name: "John Doe",
			city: "São Paulo",
			age: "PUPPY",
			energy: "LOW",
			size: "SMALL",
			independence: "LOW",
			organizationId: "1",
		});

		await petsRepository.create({
			name: "John Doe",
			city: "Rio de Janeiro",
			age: "PUPPY",
			energy: "LOW",
			size: "SMALL",
			independence: "LOW",
			organizationId: "1",
		});

		const { pets } = await sut.execute({
			city: "São Paulo",
		});

		expect(pets).toHaveLength(1);
		expect(pets).toEqual([expect.objectContaining({ id: pet.id })]);
	});

	it("should not list adopted pets", async () => {
		await petsRepository.create({
			name: "John Doe",
			city: "São Paulo",
			age: PetAge.PUPPY,
			energy: PetEnergy.LOW,
			size: PetSize.SMALL,
			independence: PetIndependence.LOW,
			organizationId: "1",
			adopted_at: new Date(),
		});

		const { pets } = await sut.execute({
			city: "São Paulo",
		});

		expect(pets).toHaveLength(0);
	});

	it("should be able to list all pets by city and size", async () => {
		await petsRepository.create({
			name: "John Doe",
			city: "São Paulo",
			age: PetAge.PUPPY,
			energy: PetEnergy.LOW,
			size: PetSize.SMALL,
			independence: PetIndependence.LOW,
			organizationId: "1",
		});

		const pet2 = await petsRepository.create({
			name: "John Doe",
			city: "São Paulo",
			age: PetAge.PUPPY,
			energy: PetEnergy.LOW,
			size: PetSize.MEDIUM,
			independence: PetIndependence.LOW,
			organizationId: "1",
		});

		const { pets } = await sut.execute({
			city: "São Paulo",
			petSize: PetSize.MEDIUM,
		});

		expect(pets).toHaveLength(1);
		expect(pets).toEqual([expect.objectContaining({ id: pet2.id })]);
	});

	it("should be able to list all pets by city and energy", async () => {
		await petsRepository.create({
			name: "John Doe",
			city: "São Paulo",
			age: PetAge.PUPPY,
			energy: PetEnergy.LOW,
			size: PetSize.SMALL,
			independence: PetIndependence.LOW,
			organizationId: "1",
		});

		const pet2 = await petsRepository.create({
			name: "John Doe",
			city: "São Paulo",
			age: PetAge.PUPPY,
			energy: PetEnergy.HIGH,
			size: PetSize.SMALL,
			independence: PetIndependence.LOW,
			organizationId: "1",
		});

		const { pets } = await sut.execute({
			city: "São Paulo",
			petEnergy: PetEnergy.HIGH,
		});

		expect(pets).toHaveLength(1);
		expect(pets).toEqual([expect.objectContaining({ id: pet2.id })]);
	});

	it("should be able to list all pets by city and independence", async () => {
		await petsRepository.create({
			name: "John Doe",
			city: "São Paulo",
			age: PetAge.PUPPY,
			energy: PetEnergy.LOW,
			size: PetSize.SMALL,
			independence: PetIndependence.LOW,
			organizationId: "1",
		});

		const pet2 = await petsRepository.create({
			name: "John Doe",
			city: "São Paulo",
			age: PetAge.PUPPY,
			energy: PetEnergy.LOW,
			size: PetSize.SMALL,
			independence: PetIndependence.HIGH,
			organizationId: "1",
		});

		const { pets } = await sut.execute({
			city: "São Paulo",
			petIndependence: PetIndependence.HIGH,
		});

		expect(pets).toHaveLength(1);
		expect(pets).toEqual([expect.objectContaining({ id: pet2.id })]);
	});

	it("should be able to list all pets by city, size, energy and independence", async () => {
		await petsRepository.create({
			name: "John Doe",
			city: "São Paulo",
			age: PetAge.PUPPY,
			energy: PetEnergy.LOW,
			size: PetSize.SMALL,
			independence: PetIndependence.LOW,
			organizationId: "1",
		});

		const pet2 = await petsRepository.create({
			name: "John Doe",
			city: "São Paulo",
			age: PetAge.PUPPY,
			energy: PetEnergy.LOW,
			size: PetSize.SMALL,
			independence: PetIndependence.HIGH,
			organizationId: "1",
		});

		const { pets } = await sut.execute({
			city: "São Paulo",
			petSize: PetSize.SMALL,
			petEnergy: PetEnergy.LOW,
			petIndependence: PetIndependence.HIGH,
		});

		expect(pets).toHaveLength(1);
		expect(pets).toEqual([expect.objectContaining({ id: pet2.id })]);
	});
});
