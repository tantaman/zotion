import { exec } from "../shared/exec";

console.log("Cleaning up resources...");

try {
  exec("rm -f /tmp/zotion.db*");
} catch (err) {
  console.info((err as Error).message);
}

try {
  exec("docker rm -f zotion");
} catch (err) {
  console.info((err as Error).message);
}

console.log("Cleanup complete.");
