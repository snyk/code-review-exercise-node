import { NPMPackage } from "./types";
import axios from "axios";
import pino from "pino";

const logger = pino();

export async function getNPMPackageByName(name: string): Promise<NPMPackage> {
  try {
    const npmPackage: NPMPackage = (
      await axios.get(`https://registry.npmjs.org/${name}`)
    ).data;

    return npmPackage;
  } catch (err) {
    logger.error(err);
    // TODO : maybe transform to specific error?
    throw err;
  }
}
