import axios from "axios";
import { Server } from "http";
import { AddressInfo } from "net";
import { setupServerForTest } from "./testHelpers";
import { presetPackageInfo } from "../src/service/package/fakePackageGetter";

describe("/healthcheck endpoint", () => {
  let server: Server;
  let port: number;

  beforeAll(async () => {
    server = setupServerForTest(presetPackageInfo({}));
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
