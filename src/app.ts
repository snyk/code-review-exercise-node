import { mountRoutes } from "./routes";

const port = 3000;

function startApp() {
  const app = mountRoutes();
  app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
  });
}

startApp();
