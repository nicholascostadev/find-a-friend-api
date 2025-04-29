import fastify from "fastify";

import { env } from "./lib/env";

const app = fastify({
  logger: env.NODE_ENV === "development"
})

app.listen({ port: env.PORT }, (err) => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }

  app.log.info(`HTTP server running! http://localhost:${env.PORT}`);
});
