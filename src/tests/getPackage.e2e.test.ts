import axios from "axios";
import { startApp } from "../app";
import { Server } from "http";
import { AddressInfo } from "net";

let server: Server;
let port: number;

beforeAll(() => {
  server = startApp(3001);
  port = (server.address() as AddressInfo).port;
});

afterAll((done) => {
  server.close(done);
});

it("fetches packages from NPM registry", async () => {
  const response = await axios.get(
    `http://localhost:${port}/package/react/16.3.0`,
  );
  expect(response.status).toBe(200);
  expect(response.data).toMatchObject({
    name: "react",
    version: "16.3.0",
    dependencies: expect.any(Object),
  });
});
