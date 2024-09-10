const core = require('@actions/core');
const exec = require('@actions/exec');

// Function to append environment variables to command
function appendEnvVars(command, envVars) {
  for (const [key, value] of Object.entries(envVars)) {
    command += ` -e ${key}=${value}`;
  }
  return command;
}

// Function to append an argument to command
function appendArg(command, arg) {
  return arg ? `${command} ${arg}` : command;
}

// Function to check if the input value is "''" and replace it with an empty string
function checkInput(input) {
  return input === "''" ? '' : input;
}

// Function to get inputs from the workflow file
function getInputs() {
  return {
    resource_type: checkInput(core.getInput('resource_type')),
    action: checkInput(core.getInput('action')),
    value: checkInput(core.getInput('value'))
  };
}

// Function to get environment variables
function getEnvVars() {
  return {
    AZURE_TENANT_ID: process.env.AZURE_TENANT_ID,
    AZURE_CLIENT_ID: process.env.AZURE_CLIENT_ID,
    AZURE_CLIENT_SECRET: process.env.AZURE_CLIENT_SECRET
  };
}

async function run() {
  try {
    // Get inputs and environment variables
    const inputs = getInputs();
    const envVars = getEnvVars();

    // Pull the Docker image
    await exec.exec('docker pull ghcr.io/stevenbuglione/fabric-cli:release');

    // Initialize command with Docker image
    let command = 'docker run --rm';

    // Append environment variables to command
    for (const [key, value] of Object.entries(envVars)) {
      command += ` \\ \n  -e ${key}="${value}"`;
    }

    // Append Docker image to command
    command += ` \\ \n  ghcr.io/stevenbuglione/fabric-cli:release`;

    // Append inputs to command
    for (const [key, value] of Object.entries(inputs)) {
      command += ` \\ \n  ${value}`;
    }

    // Run the Docker image with the necessary arguments and environment variables
    await exec.exec(command);
  } catch (error) {
    core.setFailed(error.message);
  }
}