import cors from "@fastify/cors";
import fastify from "fastify";

import fastifyJwt from "@fastify/jwt";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import {
	hasZodFastifySchemaValidationErrors,
	isResponseSerializationError,
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
} from "fastify-type-provider-zod";
import { ZodError } from "zod";
import { Exception } from "./exceptions/exception";
import { organizationRoutes } from "./http/controllers/organization/routes";
import { petsRoutes } from "./http/controllers/pets/routes";
import { env } from "./lib/env";

export const app = fastify({
	logger: env.NODE_ENV === "development",
});

app.register(cors, {
	origin: "*",
	methods: ["GET", "POST", "PUT", "DELETE"],
	allowedHeaders: ["Authorization", "Content-Type"],
	credentials: true,
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifySwagger, {
	openapi: {
		info: {
			title: "Find a friend API",
			description: "API for the Find a friend project",
			version: "1.0.0",
		},
		servers: [
			{
				url: "http://localhost:8080",
				description: "Local",
			},
		],
		tags: [
			{
				name: "organization",
				description: "Organization related endpoints",
			},
			{
				name: "pets",
				description: "Pets related endpoints",
			},
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
				},
			},
		},
	},
	transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
	routePrefix: "/docs",
});

app.register(fastifyJwt, {
	secret: env.JWT_SECRET,
});

app.register(organizationRoutes);
app.register(petsRoutes);

// Only start the server if this file is run directly, not when imported in tests
if (require.main === module) {
	app.listen({ port: env.PORT }, (err) => {
		if (err) {
			app.log.error(err);
			process.exit(1);
		}

		app.log.info(`HTTP server running! http://localhost:${env.PORT}`);
	});
}

app.setErrorHandler((error, request, reply) => {
	if (hasZodFastifySchemaValidationErrors(error)) {
		return reply.code(400).send({
			error: "Response Validation Error",
			message: "Request doesn't match the schema",
			statusCode: 400,
			details: {
				issues: error.validation,
				method: request.method,
				url: request.url,
			},
		});
	}

	if (isResponseSerializationError(error)) {
		return reply.code(500).send({
			error: "Internal Server Error",
			message: "Response doesn't match the schema",
			statusCode: 500,
			details: {
				issues: error.cause.issues,
				method: error.method,
				url: error.url,
			},
		});
	}

	if (error instanceof ZodError) {
		return reply
			.status(400)
			.send({ message: "Validation error.", issues: error.format() });
	}

	if (error instanceof Exception) {
		return reply.status(error.statusCode).send({ message: error.message });
	}

	if (env.NODE_ENV !== "production") {
		console.error(error);
	} else {
		// TODO: add a log to an external tool like DataDog/Sentry
	}

	return reply.status(500).send({ message: "Internal server error." });
});
