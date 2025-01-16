import { RequestHandler } from "express";
import { getPackageDependencies } from "../package";
import { getNPMPackageByName } from "../package/npmPackageGetter";
/**
 * Attempts to retrieve package data from the npm registry and return it
 */
export const getPackage: RequestHandler = async function (
  req,
  res,
  next,
): Promise<void> {
  const { name, version } = req.params;

  try {
    const dependencies = await getPackageDependencies(
      name,
      version,
      getNPMPackageByName,
    );

    res.status(200).json({ name, version, dependencies });
  } catch (error) {
    return next(error);
  }
};
