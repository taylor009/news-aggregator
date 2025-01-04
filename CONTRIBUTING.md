# Contributing to News Aggregator

Thank you for your interest in contributing to the News Aggregator project! This document provides guidelines and instructions for contributing.

## Development Setup

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- Git
- A NewsAPI key (for development)

### Setting Up the Development Environment

1. Fork the repository
2. Clone your fork:
```bash
git clone https://github.com/YOUR_USERNAME/news-aggregator.git
cd news-aggregator
```

3. Install dependencies:
```bash
# Frontend dependencies
cd ui
npm install

# Backend dependencies
cd ../api
npm install
```

4. Set up environment variables:
```bash
# In api/.env
NEWS_API_KEY=your_api_key_here
PORT=8080

# In ui/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Development Workflow

1. Create a new branch for your feature/fix:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes following our coding standards

3. Run tests:
```bash
# Backend tests
cd api
npm run test
npm run test:e2e

# Frontend tests
cd ui
npm run test
```

4. Commit your changes:
```bash
git add .
git commit -m "feat: description of your changes"
```

5. Push to your fork:
```bash
git push origin feature/your-feature-name
```

6. Create a Pull Request

## Coding Standards

### TypeScript
- Use TypeScript for all new code
- Maintain strict type checking
- Document complex types
- Use interfaces over types when possible

### Frontend
- Follow Next.js best practices
- Use functional components
- Implement proper error boundaries
- Keep components small and focused
- Use custom hooks for shared logic
- Follow the existing folder structure

### Backend
- Follow NestJS best practices
- Implement proper validation
- Use dependency injection
- Write comprehensive unit tests
- Document all endpoints with Swagger

### General
- Write clear commit messages following conventional commits
- Add comments for complex logic
- Update documentation for API changes
- Include tests for new features
- Follow existing code style

## Testing

### Frontend Testing
- Unit tests for components
- Integration tests for pages
- E2E tests for critical paths
- Test responsive design
- Test accessibility

### Backend Testing
- Unit tests for services
- Integration tests for controllers
- E2E tests for API endpoints
- Test error handling
- Test edge cases

## Documentation

Update documentation when you:
- Add new features
- Change existing functionality
- Modify API endpoints
- Add new dependencies
- Change configuration options

## Pull Request Process

1. Update the README.md with details of changes if needed
2. Update the API.md if you modified endpoints
3. Add tests for new functionality
4. Ensure all tests pass
5. Update documentation
6. Link relevant issues
7. Request review from maintainers

## Code Review Process

Your PR will be reviewed for:
- Code quality
- Test coverage
- Documentation
- Performance implications
- Security considerations
- Accessibility
- Browser compatibility

## Reporting Bugs

When reporting bugs:
1. Check existing issues first
2. Use the bug report template
3. Include reproduction steps
4. Provide environment details
5. Include error messages
6. Add screenshots if relevant

## Feature Requests

When requesting features:
1. Check existing issues/PRs
2. Use the feature request template
3. Explain the use case
4. Describe expected behavior
5. List potential alternatives

## Community

- Be respectful and inclusive
- Help others when possible
- Share knowledge
- Follow the code of conduct
- Participate in discussions

## Questions?

If you have questions:
1. Check the documentation
2. Search existing issues
3. Ask in discussions
4. Contact maintainers

Thank you for contributing! 