import type { Config } from "jest";

const testFilePattern = ".*\\.test\\.ts$";
const integrationTestFilePattern = ".*\\.integration.test\\.ts$";
const endToEndTestFilePattern = ".*\\.e2e.test\\.ts$";

const common: Config = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: ".",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  testEnvironment: "node",
};

const unit: Config = {
  ...common,
  displayName: "Unit",
  testRegex: testFilePattern,
  testPathIgnorePatterns: [integrationTestFilePattern, endToEndTestFilePattern],
};

const integration: Config = {
  ...common,
  displayName: "Integration",
  testRegex: integrationTestFilePattern,
};

const endToEnd: Config = {
  ...common,
  displayName: "EndToEnd",
  testRegex: endToEndTestFilePattern,
  openHandlesTimeout: 5000,
};

const config: Config = {
  projects: [unit, integration, endToEnd],
};

export default config;
