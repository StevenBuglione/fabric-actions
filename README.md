# Fabric CLI Action

This GitHub Action allows you to run Fabric CLI commands for Microsoft Fabric resources. It is designed to work with workspaces and can perform actions such as creating and listing workspaces.

## Inputs

This action requires the following inputs:

- `resource_type`: The type of Fabric resource. Currently, only 'workspace' is supported.
- `action`: The action to perform. This can be 'create' or 'list'.
- `value`: The value being passed to the action. This is required when creating a workspace and should be the name of the workspace.

## Usage

To use this action, you need to include it in your workflow file (`.github/workflows/workflow.yml` for example) and provide the necessary inputs. Here is an example of how to use this action:

```yaml
name: Fabric CLI Workflow
on: [push]

jobs:
  fabric-cli:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout code
      uses: actions/checkout@v2

    - name: Run Fabric CLI Action
      uses: stevenbuglione/fabric-cli-action@v1.0
      with:
        resource_type: 'workspace'
        action: 'create'
        value: 'my-workspace'
```

In this example, the action will create a new workspace named 'my-workspace'.

## Environment Variables

This action requires the following environment variables to be set:

- `AZURE_TENANT_ID`: Your Azure Tenant ID.
- `AZURE_CLIENT_ID`: Your Azure Client ID.
- `AZURE_CLIENT_SECRET`: Your Azure Client Secret.

These can be set in the `env` field of your workflow file:

```yaml
env:
  AZURE_TENANT_ID: ${{ secrets.AZURE_TENANT_ID }}
  AZURE_CLIENT_ID: ${{ secrets.AZURE_CLIENT_ID }}
  AZURE_CLIENT_SECRET: ${{ secrets.AZURE_CLIENT_SECRET }}
```

Please make sure to store your Azure credentials as secrets in your GitHub repository.

## Docker Image

This action uses the Docker image `ghcr.io/stevenbuglione/fabric-cli:release`. The image is pulled and run with the necessary arguments and environment variables.

## Error Handling

If there is an error while running the action, the error message will be logged and the action will fail. Please check the logs for more details.

## Contributing

Contributions are welcome! Please feel free to submit a pull request.

## License

This project is licensed under the MIT License.
 
