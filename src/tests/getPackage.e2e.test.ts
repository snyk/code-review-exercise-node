import axios from "axios";
import { GenericContainer, StartedTestContainer } from "testcontainers";

let startedContainer: StartedTestContainer;

beforeAll(async () => {
  const container = (
    await GenericContainer.fromDockerfile(".").build()
  ).withExposedPorts({ container: 3000, host: 8080 });

  startedContainer = await container.start();
}, 30_000);

afterAll(async () => {
  await startedContainer.stop();
});

it("fetches packages from NPM registry", async () => {
  const response = await axios.get(
    "http://localhost:8080/package/react/16.3.0",
  );
  expect(response.status).toBe(200);
  expect(response.data).toMatchObject({
    name: "react",
    version: "16.3.0",
    dependencies: expect.any(Object),
  });
});
