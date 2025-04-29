import { InvalidCredentialsException } from "@/exceptions/invalid-credentials-exception";
import { InMemoryOrganizationsRepository } from "@/repositories/in-memory/in-memory-organizations-repository";
import type { OrganizationsRepository } from "@/repositories/organizations-repository";
import { hash } from "bcryptjs";
import { OrganizationWithSameEmailException } from "../../exceptions/organization-with-same-email";
import { OrganizationAuthenticateService } from "./authenticate";
import { CreateOrganizationService } from "./create";

describe("Authenticate Organization Service", () => {
	let organizationsRepository: InMemoryOrganizationsRepository;
  let sut: OrganizationAuthenticateService;

	beforeEach(() => {
		organizationsRepository = new InMemoryOrganizationsRepository();
    sut = new OrganizationAuthenticateService(organizationsRepository);
	});

  it("should be able to authenticate an organization", async () => {
    const password = "123456";
    const paswordHash = await hash(password, 6);

    const organization = await organizationsRepository.create({
      name: "John Doe",
      email: "john.doe@example.com",
      password_hash: paswordHash,
      address: "123 Main St",
      whatsapp: "1234567890",
      zip_code: "1234567890",
    });

    const { organization: authenticatedOrganization } = await sut.execute({
      email: "john.doe@example.com",
      password,
    });

    expect(authenticatedOrganization.id).toEqual(organization.id);
  });

  it("should not be able to authenticate with wrong email", async () => {
    const password = "123456";
    const paswordHash = await hash(password, 6);

    const organization = await organizationsRepository.create({
      name: "John Doe",
      email: "john.doe@example.com",
      password_hash: paswordHash,
      address: "123 Main St",
      whatsapp: "1234567890",
      zip_code: "1234567890",
    });

    await expect(sut.execute({
      email: "wrong.email@example.com",
      password,
    })).rejects.toThrow(InvalidCredentialsException);
  });

  it("should not be able to authenticate with wrong password", async () => {
    const password = "123456";
    const paswordHash = await hash(password, 6);

    await organizationsRepository.create({
      name: "John Doe",
      email: "john.doe@example.com",
      password_hash: paswordHash,
      address: "123 Main St",
      whatsapp: "1234567890",
      zip_code: "1234567890",
    });

    await expect(sut.execute({
      email: "john.doe@example.com",
      password: "wrong.password",
    })).rejects.toThrow(InvalidCredentialsException);
  });

  it("should not be able to authenticate with wrong email and password", async () => {
    const password = "123456";
    const paswordHash = await hash(password, 6);

    const organization = await organizationsRepository.create({
      name: "John Doe",
      email: "john.doe@example.com",
      password_hash: paswordHash,
      address: "123 Main St",
      whatsapp: "1234567890",
      zip_code: "1234567890",
    }); 
  
    await expect(sut.execute({
      email: "wrong.email@example.com",
      password: "wrong.password",
    })).rejects.toThrow(InvalidCredentialsException);
  });

  it("should not be able to authenticate to non existing organization", async () => {
    await expect(sut.execute({
      email: "non.existing.email@example.com",
      password: "123456",
    })).rejects.toThrow(InvalidCredentialsException);
  });
});
