# GitHub action for setting up `kubectl`

This ia a simple GitHub Action for setting up the `kubectl` binary for a GitHub Workflow.

## Usage

```yaml
jobs:
  your-job:
    steps:
    - uses: jpkrohling/setup-kubectl@v1.0.0
```

or, overridding the version:

```yaml
jobs:
  your-job:
    steps:
    - uses: jpkrohling/setup-kubectl@v1.0.0
      with:
        kubectl-version: v1.15.0
```

## Contributing

This action is based on the JavaScript template. Check the [walkthrough](https://github.com/actions/toolkit/blob/master/docs/javascript-action.md) to get started with it. To contribute to this project, just open a PR with your proposed changes, making sure to include the transpiled files (`./lib/*.js`): you can get them as a result of `npm run build`.
