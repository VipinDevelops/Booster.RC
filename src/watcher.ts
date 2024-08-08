import chokidar from "chokidar";
import { exec } from "child_process";
import colors from "colors";
import debounce from "lodash/debounce";
import readline from "readline";

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to prompt user for input
const prompt = (question: string) => {
  return new Promise<string>((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
};

// Main function to set up the watcher
const main = async () => {
  const watchDirectory = await prompt(
    "Please specify the directory to watch: "
  );
  const url = await prompt("Please enter the URL: ");
  const username = await prompt("Please enter the username: ");
  const password = await prompt("Please enter the password: ");

  rl.close();
  console.log(colors.green("Watching " + watchDirectory));

  // Command template with user inputs
  const RUN_COMMAND = `rc-apps deploy --url ${url} --username ${username} --password ${password}`;
  console.log(colors.green(`Deployment Command: ${RUN_COMMAND}`));
  // Path to the directory to watch (will be set by user)
  let WATCH_DIRECTORY: string = watchDirectory;

  // Command queue and processing state
  let commandQueue: { command: string; filePath: string }[] = [];
  let isProcessing = false;
  const dot = " •    ";
  const tick = "✓";
  const cross = "✖";

  // Debounced function to process the command queue
  const processQueue = debounce(() => {
    if (isProcessing || commandQueue.length === 0) return;
    console.log(commandQueue);
    isProcessing = true;
    const { command, filePath } = commandQueue.shift()!;
    console.log(colors.blue(`File changed: ${filePath}`));

    const child = exec(command, { cwd: WATCH_DIRECTORY });

    child.stdout?.on("data", (data) => {
      const output = data.toString();
      if (output.includes("Starting App Deployment")) {
        console.log(colors.green("Deployment Started\n"));
      }
    });

    child.stderr?.on("data", (data) => {
      const output = data.toString().trim();
      if (output.includes("Getting Server Info")) {
        console.log(dot, colors.green("Getting Server Info..."));
      } else if (output.includes("Uploading App")) {
        console.log(dot, colors.green("Uploading App..."));
      } else if (output.includes("Packaging the app")) {
        console.log(dot, colors.green("Packaging the App..."));
      } else if (output.includes(tick)) {
        console.log(dot, colors.green(tick));
      } else if (output.includes(cross)) {
        console.log(dot, colors.red(cross));
      } else {
        console.log("      ", colors.red(output));
      }
    });

    child.on("error", (error) => {
      console.error(colors.red(`Error executing command: ${error.message}`));
    });

    child.on("close", (code) => {
      if (code === 0) {
        console.log(colors.green("Deployment Completed"));
      } else if (code === 2) {
        console.log(colors.red("Deployment Failed"));
      } else {
        console.log(colors.red(`Command exited with code ${code}`));
      }
      isProcessing = false;
      processQueue();
    });
  }, 3000);

  chokidar
    .watch(WATCH_DIRECTORY, {
      persistent: true,
      ignored: (filePath) =>
        filePath.includes("dist/") ||
        filePath.endsWith(".git") ||
        filePath.endsWith(".json"),
    })
    .on("change", (filePath) => {
      if (commandQueue.length <= 3) {
        commandQueue.push({ command: RUN_COMMAND, filePath });
        processQueue();
      }
    })
    .on("error", (error) => {
      console.error(colors.red(`Watcher error: ${error.message}`));
    });
};

// Start the main function
main();
