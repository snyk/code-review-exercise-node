import { NPMPackage } from "./types";

export function presetPackageInfo(packages: Record<string, NPMPackage>) {
  return async (name: string): Promise<NPMPackage> => {
    return packages[name];
  };
}
