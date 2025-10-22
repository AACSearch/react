# Publishing Guide

This guide explains how to publish @aacsearch/react to npm.

## Prerequisites

1. **npm Account**: You need an npm account. Create one at https://www.npmjs.com/signup
2. **npm CLI**: Ensure you have npm installed
3. **Organization Access**: You need access to the @aacsearch organization on npm

## Setup

### 1. Login to npm

```bash
npm login
```

Enter your npm credentials when prompted.

### 2. Verify Login

```bash
npm whoami
```

This should display your npm username.

## Pre-publish Checklist

Before publishing, ensure:

- [ ] All tests pass: `npm test`
- [ ] TypeScript compiles: `npm run type-check`
- [ ] Build completes successfully: `npm run build`
- [ ] Version is updated in `package.json`
- [ ] CHANGELOG.md is updated
- [ ] README.md is up to date
- [ ] All examples work correctly
- [ ] No uncommitted changes

## Version Management

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR** version for incompatible API changes
- **MINOR** version for backwards-compatible functionality
- **PATCH** version for backwards-compatible bug fixes

### Update Version

```bash
# For patch version (1.0.0 -> 1.0.1)
npm version patch

# For minor version (1.0.0 -> 1.1.0)
npm version minor

# For major version (1.0.0 -> 2.0.0)
npm version major
```

Or manually update `version` in `package.json`.

## Publishing

### 1. Build the Package

```bash
npm run build
```

This will:
- Compile TypeScript
- Generate type definitions
- Create ESM and CommonJS builds
- Minify the code

### 2. Test the Package Locally

Before publishing, test the package locally:

```bash
# Pack the package
npm pack

# This creates a .tgz file
# Install it in a test project:
cd /path/to/test-project
npm install /path/to/aacsearch-react/aacsearch-react-1.0.0.tgz
```

### 3. Dry Run

Perform a dry run to see what will be published:

```bash
npm publish --dry-run
```

Review the output to ensure only necessary files are included.

### 4. Publish to npm

For the first publish:

```bash
npm publish --access public
```

For subsequent publishes:

```bash
npm publish
```

### 5. Verify Publication

Visit https://www.npmjs.com/package/@aacsearch/react to verify the package is published.

## Post-publish

1. **Tag the Release**: Create a git tag for the release

```bash
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

2. **Create GitHub Release**: Create a release on GitHub with release notes

3. **Announce**: Announce the release on social media, blog, etc.

4. **Update Documentation**: Update any external documentation

## Publishing Beta Versions

For pre-release versions:

```bash
# Update version to beta
npm version 1.1.0-beta.0

# Publish with beta tag
npm publish --tag beta
```

Users can install beta versions with:

```bash
npm install @aacsearch/react@beta
```

## Unpublishing

⚠️ **Warning**: Unpublishing is not recommended as it can break projects.

To unpublish a specific version:

```bash
npm unpublish @aacsearch/react@1.0.0
```

To unpublish the entire package (within 72 hours of publishing):

```bash
npm unpublish @aacsearch/react --force
```

## Deprecating a Version

Instead of unpublishing, deprecate old versions:

```bash
npm deprecate @aacsearch/react@1.0.0 "This version has critical bugs. Please upgrade to 1.0.1+"
```

## Troubleshooting

### "You do not have permission to publish"

Ensure you're logged in and have access to the @aacsearch organization:

```bash
npm access list packages @aacsearch
```

### "Package name too similar to existing package"

Ensure your package name is unique and doesn't conflict with existing packages.

### "Version already exists"

You're trying to publish a version that already exists. Update the version number.

### Build Errors

Ensure all dependencies are installed:

```bash
npm install
```

Clean and rebuild:

```bash
rm -rf dist node_modules
npm install
npm run build
```

## CI/CD Publishing

For automated publishing via GitHub Actions, see `.github/workflows/publish.yml`.

### Setup npm Token

1. Generate an npm token: https://www.npmjs.com/settings/YOUR_USERNAME/tokens
2. Add it as a GitHub secret: `NPM_TOKEN`

### Workflow

The workflow will automatically publish when you create a new release on GitHub.

## Package Maintenance

### Update Dependencies

Regularly update dependencies:

```bash
npm update
npm audit fix
```

### Monitor Usage

Monitor package downloads and usage:
- https://www.npmjs.com/package/@aacsearch/react
- https://npm-stat.com/charts.html?package=@aacsearch/react

### Respond to Issues

Actively monitor and respond to issues on GitHub.

## Support

For questions or issues with publishing:
- Email: support@aacsearch.com
- GitHub: https://github.com/aacsearch/react/issues
