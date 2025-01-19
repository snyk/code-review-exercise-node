import { Server } from "http";
import { AddressInfo } from "net";
import axios from "axios";
import { setupServerForTest } from "./testHelpers";
import { PackageNotFoundError } from "../src/domain/errors";

describe("app", () => {
  let server: Server;
  let port: number;
  let error: Error;
  const name = "react";
  const version = "16.3.0";

  beforeAll(() => {
    server = setupServerForTest(() => {
      throw error;
    });
    port = (server.address() as AddressInfo).port;
  });

  afterAll(() => {
    server.close();
  });

  it("returns 404 for unknown routes", async () => {
    const address = `http://localhost:${port}/unknownroute`;

    const response = await axios.get(address, { validateStatus: () => true });
    expect(response.status).toBe(404);
    expect(response.data).toEqual({ error: { message: "Not found" } });
  });

  it("returns 404 for unknown packages", async () => {
    error = new PackageNotFoundError("react");

    const address = `http://localhost:${port}/package/${name}/${version}`;
    const response = await axios.get(address, { validateStatus: () => true });

    expect(response.status).toBe(404);
    expect(response.data).toEqual({
      error: { message: "Package not found", packageName: name },
    });
  });

  it("returns 500 for unknown errors", async () => {
    error = new Error("some unknown error");

    const address = `http://localhost:${port}/package/${name}/${version}`;
    const response = await axios.get(address, { validateStatus: () => true });

    expect(response.status).toBe(500);
    expect(response.data).toEqual({
      error: { message: "Internal server error" },
    });
  });
});
