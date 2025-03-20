import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import {
  getNPMPackageByName,
  REGISTRY_URL,
} from "./../../src/domain/npmPackageGetter";
import mockResponse from "./npmResponseStub.json";
import { PackageNotFoundError } from "./../../src/domain/errors";

let mock: AxiosMockAdapter;
const packageName = "react";

describe("getNPMPackageByName", () => {
  beforeEach(() => {
    mock = new AxiosMockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  it("fetches specified package", async () => {
    mock.onGet(`${REGISTRY_URL}/${packageName}`).reply(200, mockResponse);

    const npmPackage = await getNPMPackageByName(packageName);
    expect(npmPackage).toMatchObject({
      name: "react",
      versions: expect.objectContaining({
        "16.3.0": expect.objectContaining({
          dependencies: {
            fbjs: "^0.8.16",
            "prop-types": "^15.6.0",
            "loose-envify": "^1.1.0",
            "object-assign": "^4.1.1",
          },
        }),
      }),
    });
  });

  it("throws PackageNotFoundError for non-existing package", async () => {
    mock.onGet(`${REGISTRY_URL}/${packageName}`).reply(404);

    expect(getNPMPackageByName(packageName)).rejects.toThrow(
      PackageNotFoundError,
    );
  });

  it("throws error on 500 from npm registry", async () => {
    mock.onGet(`${REGISTRY_URL}/${packageName}`).reply(500);

    expect(getNPMPackageByName(packageName)).rejects.toThrow();
  });
});
