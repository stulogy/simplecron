# Contributing to SimpleCron

Thank you for your interest in contributing to SimpleCron! 🎉

## How to Contribute

### 1. Fork the Repository
- Click the "Fork" button on the GitHub repository page
- Clone your fork locally:
  ```bash
  git clone https://github.com/yourusername/simplecron.git
  cd simplecron
  ```

### 2. Set Up Development Environment
```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Test the service
npm test
```

### 3. Make Your Changes
- Create a new branch for your feature/fix:
  ```bash
  git checkout -b feature/your-feature-name
  ```
- Make your changes
- Test your changes thoroughly
- Update documentation if needed

### 4. Submit a Pull Request
- Push your changes to your fork
- Create a pull request with a clear description
- Link any related issues

## Development Guidelines

### Code Style
- Use ES6+ features
- Follow existing code patterns
- Add comments for complex logic
- Use meaningful variable names

### Testing
- Test your changes with different endpoint configurations
- Verify error handling works correctly
- Test retry logic and exponential backoff
- Ensure graceful shutdown works

### Documentation
- Update README.md if you add new features
- Add examples for new configuration options
- Update .env.example if you add new environment variables

## Types of Contributions

### 🐛 Bug Fixes
- Fix issues with existing functionality
- Improve error handling
- Fix memory leaks or performance issues

### ✨ New Features
- Add new configuration options
- Support for additional HTTP methods
- Webhook notifications
- Dashboard/UI for monitoring
- Docker improvements

### 📚 Documentation
- Improve README examples
- Add more use cases
- Create video tutorials
- Add troubleshooting guides

### 🔧 Infrastructure
- CI/CD improvements
- Docker optimizations
- Deployment guides
- Performance monitoring

## Reporting Issues

When reporting issues, please include:
- SimpleCron version
- Node.js version
- Operating system
- Steps to reproduce
- Expected vs actual behavior
- Logs (remove sensitive information)

## Feature Requests

For feature requests, please:
- Check existing issues first
- Describe the use case clearly
- Explain why it would be valuable
- Consider if it fits the project's scope

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Follow the golden rule

## Questions?

- Open a GitHub issue for questions
- Check existing issues and discussions
- Join our community discussions

Thank you for contributing to SimpleCron! 🚀
