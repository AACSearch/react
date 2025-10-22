# Contributing to @aacsearch/react

Thank you for your interest in contributing to @aacsearch/react! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please be respectful and constructive in all interactions.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue tracker to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce**
- **Expected behavior**
- **Actual behavior**
- **Environment details** (OS, Node version, React version, etc.)
- **Screenshots** (if applicable)
- **Code samples** (minimal reproduction)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Use case and motivation**
- **Detailed explanation of the proposed functionality**
- **Examples of how it would be used**
- **Potential implementation approach** (optional)

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following our coding standards
3. **Add tests** for new functionality
4. **Update documentation** as needed
5. **Ensure tests pass** and code builds
6. **Submit a pull request**

## Development Setup

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- Git

### Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/aacsearch-react.git
cd aacsearch-react

# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode
npm run dev
```

### Project Structure

```
packages/aacsearch-react/
├── src/
│   ├── client/          # SDK client
│   ├── hooks/           # React hooks
│   ├── components/      # React components
│   ├── types/           # TypeScript types
│   └── index.ts         # Main entry point
├── examples/            # Usage examples
├── dist/               # Build output (generated)
├── package.json
├── tsconfig.json
└── tsup.config.ts
```

## Coding Standards

### TypeScript

- Use TypeScript for all code
- Provide proper type definitions
- Avoid `any` types when possible
- Use interfaces for public APIs
- Use types for internal usage

### Code Style

- Follow existing code style
- Use ESLint for linting
- Use Prettier for formatting
- 2 spaces for indentation
- Single quotes for strings
- Trailing commas in objects/arrays

### Naming Conventions

- **Files**: camelCase for utilities, PascalCase for components
- **Components**: PascalCase (e.g., `SearchBox.tsx`)
- **Hooks**: camelCase starting with `use` (e.g., `useSearch.ts`)
- **Types**: PascalCase (e.g., `SearchResult`)
- **Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE

### Comments

- Use JSDoc for public APIs
- Comment complex logic
- Keep comments up to date
- Remove commented-out code

### Example

```typescript
/**
 * Performs a search query
 *
 * @param params - Search parameters
 * @returns Promise resolving to search results
 *
 * @example
 * ```typescript
 * const results = await client.search({
 *   q: 'laptop',
 *   collection: 'products',
 * });
 * ```
 */
async search<T = any>(params: SearchParams): Promise<SearchResult<T>> {
  // Implementation
}
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Writing Tests

- Write tests for new features
- Update tests for bug fixes
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

```typescript
describe('useSearch', () => {
  it('should perform search and return results', async () => {
    // Arrange
    const { result } = renderHook(() => useSearch({ collection: 'test' }));

    // Act
    await act(async () => {
      await result.current.search({ q: 'test' });
    });

    // Assert
    expect(result.current.results).toBeDefined();
    expect(result.current.loading).toBe(false);
  });
});
```

## Documentation

### README Updates

Update the README.md when:
- Adding new features
- Changing existing APIs
- Adding new examples
- Updating installation instructions

### Code Documentation

- Add JSDoc comments for all public APIs
- Include examples in documentation
- Document parameters and return types
- Explain complex logic

### Examples

Add examples in the `examples/` directory for:
- New features
- Common use cases
- Integration patterns

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): subject

body (optional)

footer (optional)
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```
feat(hooks): add useClient hook for direct SDK access

Add a new hook that provides direct access to the AACSearchClient
instance, allowing developers to call SDK methods imperatively.

Closes #123
```

```
fix(search): handle null results in SearchResults component

Prevent crash when results are null by adding proper null checks.

Fixes #456
```

## Pull Request Process

1. **Update the README.md** with details of changes if applicable
2. **Update CHANGELOG.md** with notes on your changes
3. **Ensure all tests pass** and coverage is maintained
4. **Update documentation** as needed
5. **Request review** from maintainers
6. **Address feedback** promptly
7. **Squash commits** if requested
8. Wait for approval and merge

### PR Title Format

Use the same format as commit messages:

```
feat(components): add SearchAutocomplete component
fix(hooks): resolve memory leak in useSearch
docs(readme): update installation instructions
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe how you tested your changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] Tests pass
- [ ] No new warnings
- [ ] CHANGELOG.md updated
```

## Release Process

Releases are handled by maintainers:

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create a git tag
4. Push to GitHub
5. Publish to npm
6. Create GitHub release

## Getting Help

- **Documentation**: Check the README and examples
- **Issues**: Search existing issues or create a new one
- **Discussions**: Use GitHub Discussions for questions
- **Email**: support@aacsearch.com
- **Discord**: Join our Discord community

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Thanked in our community channels

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Don't hesitate to ask questions! Open an issue or reach out to the maintainers.

Thank you for contributing to @aacsearch/react! 🎉
