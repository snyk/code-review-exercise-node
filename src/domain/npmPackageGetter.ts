import { NPMPackage } from "./types";
import axios, { AxiosError } from "axios";
import pino from "pino";
import { PackageNotFoundError } from "./errors";

const logger = pino();

export const REGISTRY_URL = "https://registry.npmjs.org";

export enum StatusCode {
  NotFound = 404,
}

export async function getNPMPackageByName(name: string): Promise<NPMPackage> {
  try {
    const npmPackage: NPMPackage = (await axios.get(`${REGISTRY_URL}/${name}`))
      .data;

    return npmPackage;
  } catch (error) {
    if (error instanceof AxiosError && error.status === StatusCode.NotFound) {
      throw new PackageNotFoundError(name);
    }

    logger.error({ error }, "Error when request package from NPM");
    throw error;
  }
}
