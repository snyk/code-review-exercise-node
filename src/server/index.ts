import pino from "pino";
import { createApp } from "../routes/app";
import { getNPMPackageByName } from "../domain/npmPackageGetter";

const logger = pino();

export function startServer(port: number) {
  const app = createApp(getNPMPackageByName);

  const server = app.listen(port, () => {
    logger.info(`Server is listening on http://localhost:${port}`);
    return;
  });

  process.on("SIGINT", () => {
    logger.info({}, "SIGINT signal received");
    server.close(() => {
      logger.info({}, "server gracefully shut down");
    });
  });
  process.on("SIGTERM", () => {
    logger.info({}, "SIGTERM signal received");
    server.close(() => {
      logger.info({}, "server gracefully shut down");
    });
  });
  return server;
}
