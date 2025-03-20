import {
  PackageNotFoundError,
  PackageVersionNotFoundError,
} from "../../src/domain/errors";
import { NextFunction, Request, Response } from "express";
import { handleErrors, notFoundHandler } from "../../src/routes/middlewares";

let mockRequest: Request;
let mockResponse: Response;
let mockNextFunction: NextFunction;

beforeEach(() => {
  mockRequest = {} as Request;
  mockResponse = {
    status: jest.fn(),
    send: jest.fn(),
  } as unknown as Response;
  mockNextFunction = jest.fn();
});

describe("notFoundHandler", () => {
  it("returns 404", () => {
    notFoundHandler(mockRequest, mockResponse, mockNextFunction);

    expect(mockResponse.send).toHaveBeenCalledWith({
      error: { message: "Not found" },
    });
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockNextFunction).toHaveBeenCalledTimes(1);
  });
});

describe("handleErrors", () => {
  it("handles PackageNotFoundError", () => {
    const error = new PackageNotFoundError("react");

    handleErrors(error, mockRequest, mockResponse, mockNextFunction);

    expect(mockResponse.send).toHaveBeenCalledWith({
      error: { message: "Package not found", packageName: "react" },
    });
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockNextFunction).not.toHaveBeenCalled();
  });

  it("handles PackageNotFoundError", () => {
    const error = new PackageVersionNotFoundError(
      "react",
      "non-existing-version",
    );

    handleErrors(error, mockRequest, mockResponse, mockNextFunction);

    expect(mockResponse.send).toHaveBeenCalledWith({
      error: {
        message: "Requested version for package not found",
        packageName: "react",
        packageVersion: "non-existing-version",
      },
    });
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockNextFunction).not.toHaveBeenCalled();
  });

  it("handles unknown errors without exposing internal details", () => {
    const error = new Error("some error with internal details");

    handleErrors(error, mockRequest, mockResponse, mockNextFunction);

    expect(mockResponse.send).toHaveBeenCalledWith({
      error: { message: "Internal server error" },
    });
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockNextFunction).not.toHaveBeenCalled();
  });
});
