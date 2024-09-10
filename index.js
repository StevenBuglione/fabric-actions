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

// Function to get inputs from the workflow file
function getInputs() {
  return {
    resource_type: core.getInput('resource_type'),
    action: core.getInput('action'),
    value: core.getInput('value')
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
    let command = 'docker run ghcr.io/stevenbuglione/fabric-cli:release';

    // Append environment variables to command
    command = appendEnvVars(command, envVars);

    // Append inputs to command
    for (const [key, value] of Object.entries(inputs)) {
      command = appendArg(command, value);
    }

    // Run the Docker image with the necessary arguments and environment variables
    await exec.exec(command);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run().catch(error => {
  console.error(error.message);
});