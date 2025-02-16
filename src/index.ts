import { startServer } from "./server";
import { program } from "commander";

const DEFAULT_PORT = "3000";

program.option(
  "-p, --port <number>",
  "Port on which the webserver will start",
  DEFAULT_PORT,
);

program.parse(process.argv);
const options = program.opts();

startServer(Number(options["port"]));
