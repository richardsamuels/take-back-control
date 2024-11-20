import { spawn } from "child_process";
import { parseArgs } from "node:util";
import { exit } from "process";

const args = parseArgs({
  options: {
    target: {
      type: "string",
      short: "t",
      default: "firefox",
    },
  },
});

const files = {
  firefox: ["./vite.config.ts", "./vite.cs.config.ts"],
  chrome: ["./vite.chrome.config.ts", "./vite.chrome.cs.config.ts"],
};

for (const file of files[args.values.target]) {
  console.log("launching: watch: ", file);
  const subprocess = spawn("yarn", ["vite", "build", "--watch", "-c", file], {
    shell: true,
    stdio: "inherit",
  });
  subprocess.on("close", (code) => {
    console.log(`Child process exited with code ${code}`);
    exit(code);
  });
}
