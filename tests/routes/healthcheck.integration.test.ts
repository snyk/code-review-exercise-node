import axios from "axios";
import { Server } from "http";
import { AddressInfo } from "net";
import {
  InMemoryPackageGetterFactory,
  setupServerForTest,
} from "../testHelpers";

describe("/healthcheck endpoint", () => {
  let server: Server;
  let port: number;

  beforeAll(async () => {
    server = setupServerForTest(
      new InMemoryPackageGetterFactory().getPackageGetter(),
    );
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
