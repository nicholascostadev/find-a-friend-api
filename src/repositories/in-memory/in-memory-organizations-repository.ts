import type { Organization, Prisma } from "@prisma/client";
import type { OrganizationsRepository } from "../organizations-repository";
export class InMemoryOrganizationsRepository implements OrganizationsRepository {
  items: Organization[] = [];

  async findByEmail(email: string) {
    const organization = this.items.find((item) => item.email === email);

    if (!organization) {
      return null;
    }

    return organization;
  }

	async create(data: Prisma.OrganizationCreateInput) {
    const organization = {
      id: "1",
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      address: data.address,
      zip_code: data.zip_code,
      whatsapp: data.whatsapp,
    }

    this.items.push(organization);

    return organization;
	}
}
