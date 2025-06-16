import { must } from "../shared/must";
import "../shared/env";
import { exec } from "../shared/exec";

const pgPassword = must(process.env.PG_PASSWORD, "PG_PASSWORD is required");

function main() {
  try {
    console.log("Attempting to start existing zotion container...");
    exec("docker start -a zotion");
    console.log("zotion container started.");
  } catch (error) {
    console.log((error as Error).message);
    console.log(
      "Existing zotion container not found or could not be started. Creating a new one...",
    );
    try {
      exec(
        `docker run --name zotion -e POSTGRES_PASSWORD=${pgPassword} -p 2445:5432 postgres -c wal_level=logical`,
      );
    } catch (runError) {
      console.error("Failed to create and run new container:", runError);
    }
  }
}

main();
