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

// Prompt user for input
const prompt = (question: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
};

// Setup the file watcher and command execution
const setupWatcher = async () => {
  const watchDirectory = await prompt(
    "Please specify the directory to watch: "
  );
  const url = await prompt("Please enter the URL: ");
  const cleanedUrl = url.endsWith("/") ? url.slice(0, -1) : url;
  const username = await prompt("Please enter the username: ");
  const password = await prompt("Please enter the password: ");

  rl.close();

  const deploymentCommand = `rc-apps deploy --url ${cleanedUrl} --username ${username} --password ${password}`;
  console.log("\n");
  console.log(colors.blue(`Deployment Command: ${deploymentCommand}`));
  console.log(colors.blue(`Watching directory: ${watchDirectory}\n`));
  console.log(colors.blue(`Waiting for File Changes...\n`));

  let commandQueue: { command: string; filePath: string }[] = [];
  let isProcessing = false;

  const processQueue = debounce(() => {
    if (isProcessing || commandQueue.length === 0) return;
    isProcessing = true;

    const { command, filePath } = commandQueue.shift()!;
    console.log(colors.blue(`File changed: ${filePath}\n`));

    const child = exec(command, { cwd: watchDirectory });

    child.stdout?.on("data", (data) => {
      const output = data.toString();
      if (output.includes("Starting App Deployment")) {
        console.log(colors.green("Deployment Started"));
      }
    });
    const isWhitespaceOnly = (str: string) => str.trim().length === 0;

    child.stderr?.on("data", (data) => {
      const output = data.toString().trim();
      if (output.includes("Getting Server Info")) {
        console.log(colors.yellow("• Getting Server Info..."));
      } else if (output.includes("Uploading App")) {
        console.log(colors.yellow("• Uploading App..."));
      } else if (output.includes("Packaging the app")) {
        console.log(colors.yellow("• Packaging the App..."));
      } else if (output.includes("✓")) {
        console.log(colors.green("• Succeeded ✓"));
      } else if (output.includes("✖")) {
        console.log(colors.red("• Failed ✖"));
      } else {
        if (!isWhitespaceOnly(output)) {
          console.log(colors.red(`• Error: ${output}`));
        }
      }
    });

    child.on("error", (error) => {
      console.error(colors.red(`Error executing command: ${error.message}`));
    });

    child.on("close", (code) => {
      if (code === 0) {
        console.log(colors.green("Deployment Completed\n"));
      } else if (code === 2) {
        console.log(colors.red("Deployment Failed\n"));
      } else {
        console.log(colors.red(`Command exited with code ${code}\n`));
      }
      isProcessing = false;
      processQueue();
    });
  }, 3000);

  chokidar
    .watch(watchDirectory, {
      persistent: true,
      ignored: (filePath) =>
        filePath.includes("dist/") ||
        filePath.endsWith(".git") ||
        filePath.endsWith(".json"),
    })
    .on("change", (filePath) => {
      if (commandQueue.length < 3) {
        commandQueue.push({ command: deploymentCommand, filePath });
        processQueue();
      }
    })
    .on("error", (error) => {
      console.error(colors.red(`Watcher error: ${error.message}`));
    });
};

// Start the script
setupWatcher();
