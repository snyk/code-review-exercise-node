import type { Config } from "jest";

const testFilePattern = ".*\\.test\\.ts$";
const integrationTestFilePattern = ".*\\.integration.test\\.ts$";

const common: Config = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "src",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  testEnvironment: "node",
};

const unit: Config = {
  ...common,
  displayName: "Unit",
  testRegex: testFilePattern,
  testPathIgnorePatterns: [integrationTestFilePattern],
};

const integration: Config = {
  ...common,
  displayName: "Integration",
  testRegex: integrationTestFilePattern,
};

const config: Config = {
  projects: [unit, integration],
};

export default config;
