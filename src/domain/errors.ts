export class PackageNotFoundError extends Error {
  constructor(public packageName: string) {
    super();
  }
}

export class PackageVersionNotFoundError extends Error {
  constructor(
    public packageName: string,
    public packageVersion: string,
  ) {
    super();
  }
}
