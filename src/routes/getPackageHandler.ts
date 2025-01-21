import { NextFunction, RequestHandler, Request, Response } from "express";
import { getPackageDependencies } from "../domain/getPackageDependencies";
import { PackageGetter } from "../domain/types";

export function getPackageHandler(
  packageGetter: PackageGetter,
): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { packageName, packageVersion } = req.params;
    try {
      const dependencies = await getPackageDependencies(
        packageName,
        packageVersion,
        packageGetter,
      );
      res
        .status(200)
        .json({ name: packageName, version: packageVersion, dependencies });
    } catch (error) {
      return next(error);
    }
  };
}
