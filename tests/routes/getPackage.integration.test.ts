import { Server } from "http";
import { setupServerForTest } from "../testHelpers";
import { AddressInfo } from "net";
import axios from "axios";
import { presetPackageInfo } from "../domain/fakePackageGetter";
import { generatePackage } from "../testHelpers";

describe("/package/:name/:version endpoint", () => {
  let server: Server;
  let port: number;

  beforeAll(async () => {
    const name = "react";
    const version = "16.3.0";

    const innerName = "loose-envify";
    const innerVersion = "1.1.0";

    const originalDependencies = {
      [innerName]: innerVersion,
    };

    const requestedPackage = generatePackage(
      name,
      version,
      originalDependencies,
    );
    const innerPackage = generatePackage(innerName, innerVersion, {});

    const packageGetter = presetPackageInfo({
      [name]: requestedPackage,
      [innerName]: innerPackage,
    });

    server = setupServerForTest(packageGetter);
    port = (server.address() as AddressInfo).port;
  });

  afterAll(() => {
    server.close();
  });

  it("responds with list of dependencies", async () => {
    const packageName = "react";
    const version = "16.3.0";
    const address = `http://localhost:${port}/package/${packageName}/${version}`;
    const response = await axios.get(address);
    expect(response.status).toBe(200);
    const expectedResponse = {
      name: "react",
      version: "16.3.0",
      dependencies: { "loose-envify": "1.1.0" },
    };

    expect(response.data).toEqual(expectedResponse);
  });
});
