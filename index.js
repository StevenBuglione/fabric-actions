const core = require('@actions/core');
const exec = require('@actions/exec');


// Function to get inputs from the workflow file
function getInputs() {
  return {
    resource_type: core.getInput('resource_type'),
    action: core.getInput('action'),
    value: core.getInput('value')
  };
}

async function run() {
  try {
    // Get inputs
    const inputs = getInputs();

    // Pull the Docker image
    await exec.exec('docker pull ghcr.io/stevenbuglione/fabric-cli:release');

    // Initialize command with Docker image and hardcoded environment variables
    let command = 'docker run --rm' +
        ' -e AZURE_TENANT_ID="' + process.env.AZURE_TENANT_ID + '"' +
        ' -e AZURE_CLIENT_ID="' + process.env.AZURE_CLIENT_ID + '"' +
        ' -e AZURE_CLIENT_SECRET="' + process.env.AZURE_CLIENT_SECRET + '"' +
        ' ghcr.io/stevenbuglione/fabric-cli:release';

    // Append inputs to command inline
    command += ` ${inputs.resource_type} ${inputs.action} ${inputs.value}`;

    // Run the Docker image with the necessary arguments and environment variables
    await exec.exec(command);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run().catch(error => {
  console.error(error.message);
});