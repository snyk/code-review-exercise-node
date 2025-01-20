import { Server } from "http";
import { setupServerForTest } from "../testHelpers";
import { AddressInfo } from "net";
import axios from "axios";
import { InMemoryPackageGetter } from "../testHelpers";

const packageName = "react";
const packageVersion = "16.3.0";

describe("/package/:name/:version endpoint", () => {
  let server: Server;
  let port: number;

  beforeAll(async () => {
    const packageGetter = new InMemoryPackageGetter();

    const dependencies = {
      "loose-envify": "1.1.0",
    };

    packageGetter.setDependenciesForPackageAndVersion(
      packageName,
      packageVersion,
      dependencies,
    );
    packageGetter.setDependenciesForPackageAndVersion("loose-envify", "1.1.0");

    server = setupServerForTest(packageGetter.getPackageGetter());
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
