import { mountRoutes } from "./routes";
import pino from "pino";

const logger = pino();
const port = 3000;

function startApp() {
  const app = mountRoutes();
  app.listen(port, () => {
    logger.info(`Express is listening at http://localhost:${port}`);
    return;
  });
}

startApp();
