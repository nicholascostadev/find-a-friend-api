import { randomUUID } from "node:crypto";
import { ResourceNotFoundException } from "@/exceptions/resource-not-found-exception";
import type { Pet, Prisma } from "@prisma/client";
import type {
	FindManyByFiltersParams,
	PetsRepository,
} from "../pets-repository";

export class InMemoryPetsRepository implements PetsRepository {
	items: Pet[] = [];

	async findById(id: string) {
		const pet = this.items.find((item) => item.id === id);

		if (!pet) {
			return null;
		}

		return pet;
	}

	async findManyByFilters(params: FindManyByFiltersParams) {
		return this.items.filter((item) => {
			if (item.adopted_at) {
				return false;
			}

			if (item.city !== params.city) {
				return false;
			}

			if (params.petSize && item.size !== params.petSize) {
				return false;
			}

			if (params.petEnergy && item.energy !== params.petEnergy) {
				return false;
			}

			if (
				params.petIndependence &&
				item.independence !== params.petIndependence
			) {
				return false;
			}

			return true;
		});
	}

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
			adopted_at: data.adopted_at ? new Date(data.adopted_at) : null,
		};

		this.items.push(pet);

		return pet;
	}

	async updateAdoptmentDate(petId: string, adoptedAt: Date | null) {
		const petIndex = this.items.findIndex((item) => item.id === petId);

		if (petIndex === -1) {
			throw new ResourceNotFoundException("Pet not found");
		}

		this.items[petIndex].adopted_at = adoptedAt;

		return this.items[petIndex];
	}
}
