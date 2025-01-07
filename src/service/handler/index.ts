import { RequestHandler } from "express";
import { getPackageDependencies } from "../package";
import { getNPMPackageByName } from "../package/npmPackageGetter";
/**
 * Attempts to retrieve package data from the npm registry and return it
 */
export const getPackage: RequestHandler = async function (req, res, next) {
  const { name, version } = req.params;

  if (typeof name !== "string" || typeof version !== "string") {
    return next(new Error("input failed validation"));
  }

  try {
    const dependencies = await getPackageDependencies(
      name,
      version,
      getNPMPackageByName,
    );

    return res.status(200).json({ name, version, dependencies });
  } catch (error) {
    return next(error);
  }
};
