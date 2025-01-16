import { NextFunction, RequestHandler, Request, Response } from "express";
import { getPackageDependencies, PackageGetter } from "../package";

/**
 * Attempts to retrieve package data from the npm registry and return it
 */
export function getPackageHandler(
  packageGetter: PackageGetter,
): RequestHandler {
  const x = async (req: Request, res: Response, next: NextFunction) => {
    const { name, version } = req.params;
    try {
      const dependencies = await getPackageDependencies(
        name,
        version,
        packageGetter,
      );
      res.status(200).json({ name, version, dependencies });
    } catch (error) {
      return next(error);
    }
  };
  return x;
}
