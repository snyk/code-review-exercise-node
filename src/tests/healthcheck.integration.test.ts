import axios from "axios";
import { Server } from "http";
import { createApp } from "../routes/index";
import { AddressInfo } from "net";

export function setupServerForTest(): Server {
  const app = createApp();
  const server = app.listen();

  return server;
}

describe("/healthcheck endpoint", () => {
  let server: Server;
  let port: number;

  beforeAll(async () => {
    server = setupServerForTest();
    port = (server.address() as AddressInfo).port;
  });

  afterAll(() => {
    server.close();
  });

  it("responds with 204", async () => {
    const address = `http://localhost:${port}/healthcheck`;
    const response = await axios.get(address);
    expect(response.status).toBe(204);
  });
});
