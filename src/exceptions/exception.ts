import z from "zod";

export abstract class Exception extends Error {
	abstract statusCode: number;
}

export const ExceptionSchema = z.object({
	message: z.string(),
});
