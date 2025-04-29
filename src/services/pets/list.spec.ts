import { InMemoryPetsRepository } from "@/repositories/in-memory/in-memory-pets-repository";
import { ListPetsService } from "./list";

describe("Create Pet Service", () => {
	let petsRepository: InMemoryPetsRepository;
	let sut: ListPetsService;

	beforeEach(() => {
		petsRepository = new InMemoryPetsRepository();
		sut = new ListPetsService(petsRepository);
	});

	it("should be able to create an organization", async () => {
    const pet = await petsRepository.create({
      name: "John Doe",
      city: "São Paulo",
      age: "PUPPY",
      energy: "LOW",
      size: "SMALL",
      independence: "LOW",
      organizationId: "1",
    });

		const { pets } = await sut.execute();

		expect(pets).toEqual([
			expect.objectContaining({ id: pet.id }),
		]);
	});

  it("should be able to list all pets", async () => {
    const pet = await petsRepository.create({
      name: "John Doe",
      city: "São Paulo",
      age: "PUPPY",
      energy: "LOW",  
      size: "SMALL",
      independence: "LOW",
      organizationId: "1",
    });

    const pet2 = await petsRepository.create({
      name: "John Doe",
      city: "São Paulo",
      age: "PUPPY",
      energy: "LOW",  
      size: "SMALL",
      independence: "LOW",
      organizationId: "1",
    });

    const { pets } = await sut.execute();

    expect(pets).toEqual([
      expect.objectContaining({ id: pet.id }),
      expect.objectContaining({ id: pet2.id }),
    ]);
  });
});
