import { PackageName, PackageVersion } from "./types";

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
