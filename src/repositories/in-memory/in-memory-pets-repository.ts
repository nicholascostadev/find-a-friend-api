import { randomUUID } from "node:crypto";
import type { Pet, Prisma } from "@prisma/client";
import type { PetsRepository } from "../pets-repository";

export class InMemoryPetsRepository implements PetsRepository {
	items: Pet[] = [];

	async create(data: Prisma.PetUncheckedCreateInput) {
    const pet: Pet = {
      id: data?.id ?? randomUUID(),
      name: data.name,
      city: data.city,
      age: data.age,
      energy: data.energy,
      size: data.size,
      independence: data.independence,
      organizationId: data.organizationId ?? null,
    }

    this.items.push(pet);

    return pet;
  }
}
