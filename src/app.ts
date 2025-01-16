import { createApp } from "./routes";
import pino from "pino";

const logger = pino();
const PORT = 3000;

function startApp() {
  const app = createApp();
  const server = app.listen(PORT, () => {
    logger.info(`Server is listening on http://localhost:${PORT}`);
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
}

startApp();
