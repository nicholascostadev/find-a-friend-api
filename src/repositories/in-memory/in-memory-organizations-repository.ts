import { randomUUID } from "node:crypto";
import type { Organization, Prisma } from "@prisma/client";
import type { OrganizationsRepository } from "../organizations-repository";
export class InMemoryOrganizationsRepository
	implements OrganizationsRepository
{
	items: Organization[] = [];

	async findById(id: string) {
		const organization = this.items.find((item) => item.id === id);

		if (!organization) {
			return null;
		}

		return organization;
	}

	async findByEmail(email: string) {
		const organization = this.items.find((item) => item.email === email);

		if (!organization) {
			return null;
		}

		return organization;
	}

	async create(data: Prisma.OrganizationCreateInput) {
		const organization = {
			id: data?.id ?? randomUUID(),
			name: data.name,
			email: data.email,
			password_hash: data.password_hash,
			address: data.address,
			zip_code: data.zip_code,
			whatsapp: data.whatsapp,
		};

		this.items.push(organization);

		return organization;
	}
}
