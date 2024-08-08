import chokidar from "chokidar";
import { exec } from "child_process";
import path from "path";
import colors from "colors";
import debounce from "lodash/debounce";

// Path to watch
const pathToWatch =
  "/home/vipin/Desktop/opensource/Apps/Rocket.Chat.Welcome.App"; // Replace with your folder path

// Command template to run when a change is detected
const commandTemplate =
  "rc-apps deploy --url http://localhost:3000 --username vipin.chaudhary --password VipinDev";

// Command queue
let commandQueue: any = [];
let isProcessing = false;
let lastFilePath = "";

// Debounced function to process file changes
const debouncedProcessQueue = debounce(() => {
  if (isProcessing || commandQueue.length === 0) return;

  isProcessing = true;
  const { command, filePath } = commandQueue.shift();
  console.log(commandQueue, "--------");

  lastFilePath = filePath;

  // if (filePath === lastFilePath) {
  //   isProcessing = false;
  //   debouncedProcessQueue(); // Process the next command in the queue
  //   return;
  // }

  console.log(colors.blue("      " + `File changed: ${filePath}`));

  const child = exec(command, { cwd: pathToWatch });

  if (child.stdout) {
    child.stdout.on("data", (data) => {
      const output = data.toString();
      if (output.includes("Starting App Deployment")) {
        console.log(colors.green("      " + "Deployment Started\n"));
      }
    });
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
      } else if (output.includes("✓")) {
        console.log(" •    ", colors.green("✓"));
      } else if (output.includes("✖")) {
        console.log(" •    ", colors.red("✖"));
      } else {
        console.log("      ", colors.red(output));
      }
    });
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
    isProcessing = false;
    debouncedProcessQueue(); // Process the next command in the queue
  });
}, 3000);

// Initialize watcher
chokidar
  .watch(pathToWatch, {
    persistent: true,
    ignored: (path) =>
      path.includes("dist/") || path.endsWith(".git") || path.endsWith(".json"),
  })
  .on("change", (filePath) => {
    // Queue the command for execution and debounce the processing
    if (commandQueue.length <= 3) {
      commandQueue.push({ command: commandTemplate, filePath });
      debouncedProcessQueue();
    }
  })
  .on("error", (error) =>
    console.error(colors.red("      " + `Watcher error: ${error.message}`))
  );
