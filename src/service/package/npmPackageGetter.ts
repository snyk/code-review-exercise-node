import { NPMPackage } from "./types";
import axios from "axios";

export async function getNPMPackageByName(name: string): Promise<NPMPackage> {
  try {
    const npmPackage: NPMPackage = (
      await axios.get(`https://registry.npmjs.org/${name}`)
    ).data;

    return npmPackage;
  } catch (err) {
    console.log(err);
    // TODO : maybe transform to specific error?
    throw err;
  }
}
