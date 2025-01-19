export class PackageNotFoundError extends Error {
  constructor(public packageName: string) {
    super();
  }
}
