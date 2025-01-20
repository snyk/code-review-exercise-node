import { NPMPackage } from "./types";

export const generatePackage = (
  name: string,
  version: string,
  dependencies: Record<string, string>,
): NPMPackage => ({
  name,
  description: "",
  "dist-tags": {},
  versions: {
    [version]: {
      name,
      version,
      dependencies,
    },
  },
});
