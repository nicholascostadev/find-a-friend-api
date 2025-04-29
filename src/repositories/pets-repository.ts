import type { Pet, PetEnergy, PetIndependence, PetSize, Prisma } from "@prisma/client";

export interface FindManyByFiltersParams {
  city?: string;
  petSize?: PetSize;
  petEnergy?: PetEnergy;
  petIndependence?: PetIndependence;
}

export interface PetsRepository {
  create(data: Prisma.PetCreateInput): Promise<Pet>
  findById(id: string): Promise<Pet | null>
  findManyByFilters(params: FindManyByFiltersParams): Promise<Pet[]>
}