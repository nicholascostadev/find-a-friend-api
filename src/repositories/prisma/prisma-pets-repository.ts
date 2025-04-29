import { db } from "@/lib/infra/database";
import type { Prisma } from "@prisma/client";
import type {
	FindManyByFiltersParams,
	PetsRepository,
} from "../pets-repository";

export class PrismaPetsRepository implements PetsRepository {
	async findById(id: string) {
		const pet = await db.pet.findUnique({
			where: {
				id,
			},
		});

		return pet;
	}

	async findManyByFilters(filters: FindManyByFiltersParams) {
		const pets = await db.pet.findMany({
			where: filters,
		});

		return pets;
	}

	async create(data: Prisma.PetCreateInput) {
		const pet = await db.pet.create({ data });

		return pet;
	}

	async updateAdoptmentDate(petId: string, adoptedAt: Date | null) {
		const updatedPet = await db.pet.update({
			where: { id: petId },
			data: { adopted_at: adoptedAt },
		});

		return updatedPet;
	}
}
