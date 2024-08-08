import chokidar from "chokidar";
import { exec } from "child_process";
import path from "path";
import colors from "colors";

// Path to watch
const pathToWatch =
  "/home/vipin/Desktop/opensource/Apps/Rocket.Chat.Welcome.App"; // Replace with your folder path

// Command template to run when a change is detected
const commandTemplate =
  "rc-apps deploy --url http://localhost:3000 --username vipin.chaudhary --password VipinDev";

let Uploading = false;

const tick = "✓";
const cross = "✖";
// Initialize watcher
chokidar
  .watch(pathToWatch, {
    persistent: true,
    ignored: (path) =>
      path.includes("dist/") || path.endsWith(".git") || path.endsWith(".json"),
  })
  .on("change", (filePath) => {
    console.log(colors.blue("      " + `File changed: ${filePath}`));

    // Prepare the command
    const command = commandTemplate;

    const child = exec(command, { cwd: pathToWatch });

    if (child.stdout) {
      child.stdout.on("data", (data) => {
        const output = data.toString();
        if (output.includes("Starting App Deployment")) {
          console.log(colors.green("      " + "Deployment Started\n"));
        }
      });
    } else {
      console.log(colors.red("No stdout"));
    }

    if (child.stderr) {
      child.stderr.on("data", (data) => {
        const output = data.toString().trim();
        if (output.includes("Getting Server Info")) {
          console.log(" •    ", colors.green("Getting Server Info..."));
        } else if (output.includes("Uploading App")) {
          console.log(" •    ", colors.green("Uploading App..."));
        } else if (output.includes("Packaging the app")) {
          console.log(" •    ", colors.green("Packaging the App..."));
        } else if (output.includes(tick)) {
          console.log(" •    ", colors.green(tick));
        } else if (output.includes(cross)) {
          console.log(" •    ", colors.red(cross));
        } else {
          console.log("      ", colors.red(output));
        }
      });
    } else {
      console.log(colors.red("No stderr"));
    }

    child.on("error", (error) => {
      console.error(colors.red(`Error executing command: ${error.message}`));
    });

    child.on("close", (code) => {
      if (code === 0) {
        console.log(colors.green("      " + "Deployment Completed"));
      } else if (code === 2) {
        console.log(colors.red("Deployment Failed"));
      } else {
        console.log(colors.red("      " + `Command exited with code ${code}`));
      }
    });
  })
  .on("error", (error) =>
    console.error(colors.red("      " + `Watcher error: ${error.message}`))
  );
