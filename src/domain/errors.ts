import { PackageName, PackageVersion } from "./types";

// we can log something a maybe indicate what we throw , currently we take the name and version and only throw it
export class PackageNotFoundError extends Error {
  constructor(public packageName: PackageName) {
    super();
  }
}

export class PackageVersionNotFoundError extends Error {
  constructor(
    public packageName: PackageName,
    public packageVersion: PackageVersion,
  ) {
    super();
  }
}
