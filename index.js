const core = require('@actions/core');
const exec = require('@actions/exec');

// Function to get inputs from the GitHub Action
function getInputs() {
  return {
    resource_type: core.getInput('resource_type'),
    action: core.getInput('action'),
    value: core.getInput('value')
  };
}

// Function to format the command for creating a workspace
function getWorkspaceCreateCommand(inputs){
  return `${inputs.resource_type} ${inputs.action} ${inputs.value}`;
}

// Function to format the command for listing workspaces
function getWorkspaceListCommand(inputs){
  return `${inputs.resource_type} ${inputs.action}`;
}

// Function to get the formatted command based on the inputs
function getFormatedCommand() {
  const inputs = getInputs();

  if(inputs.resource_type === 'workspace' && inputs.action === 'create'){
    return getWorkspaceCreateCommand(inputs);
  }

  if(inputs.resource_type === 'workspace' && inputs.action === 'list'){
    return getWorkspaceListCommand(inputs);
  }
}

// Main function to run the Docker command
async function run() {
  try {
    // Pull the Docker image
    await exec.exec('docker pull ghcr.io/stevenbuglione/fabric-cli:2.0.0');

    // Initialize command with Docker image and hardcoded environment variables
    let command = `docker run --rm -e AZURE_USERNAME="${process.env.AZURE_USERNAME}" -e AZURE_PASSWORD="${process.env.AZURE_PASSWORD}" ghcr.io/stevenbuglione/fabric-cli:2.0.0`;

    // Append inputs to command inline
    command += ` ${getFormatedCommand()}`;

    // Run the Docker image with the necessary arguments and environment variables
    await exec.exec(command);
  } catch (error) {
    core.setFailed(error.message);
  }
}

// Run the main function and log any errors
run().catch(error => {
  console.error(error.message);
});