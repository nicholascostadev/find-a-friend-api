import { app } from "./app";
import { env } from "./lib/env";

app.listen({ port: env.PORT }, (err) => {
	if (err) {
		app.log.error(err);
		process.exit(1);
	}

	app.log.info(`HTTP server running! http://localhost:${env.PORT}`);
});
