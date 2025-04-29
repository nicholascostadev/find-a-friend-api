import { Exception } from "./exception";

export class OrganizationWithSameEmailException extends Exception {
  statusCode = 400;

  constructor() {
    super("Organization with same email already exists.");
  }
}
