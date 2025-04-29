import { InMemoryPetsRepository } from "@/repositories/in-memory/in-memory-pets-repository";
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

		expect(pets).toEqual([
			expect.objectContaining({ id: pet.id }),
		]);
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

    expect(pets).toHaveLength(1)
    expect(pets).toEqual([
      expect.objectContaining({ id: pet.id }),
    ]);
  });

  it("should be able to list all pets by city and size", async () => {
    await petsRepository.create({
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
      size: "MEDIUM",
      independence: "LOW",
      organizationId: "1",
    });

    const { pets } = await sut.execute({
      city: "São Paulo",
      petSize: "MEDIUM",
    });

    expect(pets).toHaveLength(1)
    expect(pets).toEqual([
      expect.objectContaining({ id: pet2.id }),
    ]);
  });

  it("should be able to list all pets by city and energy", async () => {
   await petsRepository.create({
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
      energy: "HIGH",
      size: "SMALL",
      independence: "LOW",
      organizationId: "1",
    });

    const { pets } = await sut.execute({
      city: "São Paulo",
      petEnergy: "HIGH",
    });

    expect(pets).toHaveLength(1)
    expect(pets).toEqual([
      expect.objectContaining({ id: pet2.id }),
    ]);
  });

  it("should be able to list all pets by city and independence", async () => {
    await petsRepository.create({
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
      independence: "HIGH",
      organizationId: "1",
    });   

    const { pets } = await sut.execute({
      city: "São Paulo",
      petIndependence: "HIGH",
    }); 

    expect(pets).toHaveLength(1)
    expect(pets).toEqual([
      expect.objectContaining({ id: pet2.id }),
    ]);
  });

  it("should be able to list all pets by city, size, energy and independence", async () => {
    await petsRepository.create({
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
      independence: "HIGH",
      organizationId: "1",
    });

    const { pets } = await sut.execute({
      city: "São Paulo",
      petSize: "SMALL",
      petEnergy: "LOW",
      petIndependence: "HIGH",
    });

    expect(pets).toHaveLength(1)
    expect(pets).toEqual([
      expect.objectContaining({ id: pet2.id }),
    ]);
  });
});
