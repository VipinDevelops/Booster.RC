import chokidar from "chokidar";
import { exec } from "child_process";
import path from "path";
// Path to watch
const pathToWatch = "/home/vipin/Desktop/GSoC/Apps.QuickReplies"; // Replace with your folder path

// Command template to run when a change is detected
const commandTemplate =
  "rc-apps deploy --url http://localhost:3000 --username vipin.chaudhary --password VipinDev";

// const commandTemplate = "ls";
// Initialize watcher
chokidar
  .watch(pathToWatch, {
    persistent: true,
    ignored: (path) =>
      path.includes("dist/") || path.endsWith(".git") || path.endsWith(".json"),
  })
  .on("change", (filePath) => {
    console.log(`File changed: ${filePath}`);

    // Prepare the command

    const command = commandTemplate;
    // const CommandPath = path.dirname(pathToWatch);

    exec(command, { cwd: pathToWatch }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error.message}`);
        return;
      }
      if (stdout) {
        console.log(`Command output:\n${stdout}`);
      }
      if (stderr) {
        console.error(`Command errors:\n${stderr}`);
      }
    });
  })
  .on("error", (error) => console.error(`Watcher error: ${error.message}`));
