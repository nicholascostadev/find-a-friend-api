import { InMemoryOrganizationsRepository } from "@/repositories/in-memory/in-memory-organizations-repository";
import type { OrganizationsRepository } from "@/repositories/organizations-repository";
import { OrganizationWithSameEmailException } from "../../exceptions/organization-with-same-email";
import { CreateOrganizationService } from "./create";

describe("Create Organization Service", () => {
	let organizationsRepository: OrganizationsRepository;

	beforeEach(() => {
		organizationsRepository = new InMemoryOrganizationsRepository();
	});

	it("should be able to create an organization", async () => {
		const createOrganizationService = new CreateOrganizationService(
			organizationsRepository,
		);

		const password = "123456";

		const { organization } = await createOrganizationService.execute({
			name: "John Doe",
			email: "john.doe@example.com",
			password,
			address: "123 Main St",
			whatsapp: "1234567890",
			zipCode: "1234567890",
		});

		expect(organization.id).toEqual(expect.any(String));
		expect(organization.password_hash).not.toEqual(password);
	});

	it("should not be able to create an organization with same email", async () => {
		const createOrganizationService = new CreateOrganizationService(
			organizationsRepository,
		);

		const password = "123456";

		const data = {
			name: "John Doe",
			email: "john.doe@example.com",
			password,
			address: "123 Main St",
			whatsapp: "1234567890",
			zipCode: "1234567890",
		};

		await createOrganizationService.execute(data);

		await expect(createOrganizationService.execute(data)).rejects.toThrow(
			OrganizationWithSameEmailException,
		);
	});
});
