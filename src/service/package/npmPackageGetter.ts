import { NPMPackage } from "./types";
import got from "got";

export async function getNPMPackageByName(name: string): Promise<NPMPackage> {
  try {
    const npmPackage: NPMPackage = await got(
      `https://registry.npmjs.org/${name}`,
    ).json();

    return npmPackage;
  } catch (err) {
    console.log(err);
    // TODO : maybe transform to specific error?
    throw err;
  }
}
