# News Aggregator

A modern news aggregation platform built with Next.js and NestJS, featuring real-time updates, personalization, and advanced filtering capabilities.

## Features

### Core Features
- **Article Listing**: Browse articles with pagination and dynamic loading
- **Article Detail View**: Read full articles with rich content and metadata
- **Search Functionality**: Search across all articles with instant results
- **Category Filtering**: Filter articles by multiple categories
- **Responsive Design**: Fully responsive UI that works on all devices
- **Dark Mode**: Toggle between light and dark themes

### Bonus Features
- **Real-time Updates**: Get notified when new articles are published
- **User Personalization**: Save preferred states and topics for relevant articles
- **Article Bookmarking**: Save articles to read later
- **Share Functionality**: Share articles via social media or copy link
- **Advanced Filtering**: Combine multiple filters and search criteria
- **Article Analytics**: Track views, shares, and bookmarks
- **Newsletter Subscription**: Get daily email summaries of articles
- **User Preferences**: Set default view settings (items per page, sort order, theme)

## Tech Stack

### Frontend (ui/)
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Shadcn/ui Components
- React Query for data fetching
- React Hot Toast for notifications

### Backend (api/)
- NestJS
- TypeScript
- SQLite with TypeORM
- NewsAPI integration
- WebSocket for real-time updates
- Class Transformer/Validator

## Getting Started

### Prerequisites
- Node.js 18 or higher
- NewsAPI Key (get one at https://newsapi.org)

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd news-aggregator
\`\`\`

2. Install dependencies:
\`\`\`bash
# Install frontend dependencies
cd ui
npm install

# Install backend dependencies
cd ../api
npm install
\`\`\`

3. Set up environment variables:

Create \`.env\` in the api/ directory:
\`\`\`env
NEWS_API_KEY=your_api_key_here
PORT=8080
\`\`\`

Create \`.env.local\` in the ui/ directory:
\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:8080
\`\`\`

### Running the Application

1. Start the backend:
\`\`\`bash
cd api
npm run start:dev
\`\`\`

2. Start the frontend:
\`\`\`bash
cd ui
npm run dev
\`\`\`

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:8080
- API Documentation: http://localhost:8080/api

## Architecture

Detailed architecture diagrams can be found in the `documentation/diagrams` directory:
- [System Architecture](documentation/diagrams/system-architecture.md): High-level overview of system components and their interactions
- [Component Diagram](documentation/diagrams/component-diagram.md): Detailed breakdown of internal components and their relationships

### Frontend Architecture
- **App Router**: Utilizes Next.js 14's app router for page routing
- **Components**: Reusable UI components in `src/components`
- **Hooks**: Custom hooks for state management in `src/lib/hooks`
- **Utils**: Helper functions in `src/lib/utils`
- **Types**: TypeScript interfaces and types in `src/types`

### Backend Architecture
- **Modules**: Feature-based modules (Articles, News, Analytics)
- **Services**: Business logic layer
- **Controllers**: API endpoints and request handling
- **Entities**: Database models and schemas
- **DTOs**: Data transfer objects for validation
- **Schedulers**: Background tasks for fetching news

### Database Schema
- **Articles**: Stores article data and metadata
- **Analytics**: Tracks article interactions
- **NewsletterSubscribers**: Manages newsletter subscriptions
- **UserPreferences**: Stores user settings and preferences

## API Endpoints

### Articles
- `GET /articles`: List articles with pagination and filters
- `GET /articles/:id`: Get article details
- `GET /articles/categories`: Get available categories
- `POST /articles/bookmark`: Bookmark an article
- `DELETE /articles/bookmark`: Remove bookmark

### Analytics
- `GET /analytics/trending`: Get trending articles
- `POST /analytics/view`: Record article view
- `POST /analytics/share`: Record article share

### Newsletter
- `POST /newsletter/subscribe`: Subscribe to newsletter
- `DELETE /newsletter/unsubscribe`: Unsubscribe from newsletter
- `GET /newsletter/preferences`: Get subscription preferences
- `PUT /newsletter/preferences`: Update preferences

### User Preferences
- `GET /preferences`: Get user preferences
- `PUT /preferences`: Update user preferences

## Real-time Updates
The application uses WebSocket connections for real-time features:
- New article notifications
- Trending articles updates
- Bookmark synchronization

## Deployment

The application can be deployed using Docker and Docker Compose. Make sure you have Docker and Docker Compose installed on your system.

### Prerequisites
- Docker Engine 20.10.0 or higher
- Docker Compose 2.0.0 or higher
- A NewsAPI key

### Environment Setup

1. Create a `.env` file in the root directory:
```env
NEWS_API_KEY=your_api_key_here
```

### Building and Running

1. Build and start the containers:
```bash
docker-compose up --build
```

2. For production deployment, use:
```bash
docker-compose -f docker-compose.yml up -d
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- API Documentation: http://localhost:8080/api

### Container Management

- Stop the containers:
```bash
docker-compose down
```

- View container logs:
```bash
# All containers
docker-compose logs -f

# Specific service
docker-compose logs -f api
docker-compose logs -f ui
```

- Restart services:
```bash
docker-compose restart api
docker-compose restart ui
```

### Data Persistence
- SQLite database is persisted in `./api/data`
- Make sure to backup this directory regularly

### Health Monitoring
- API health endpoint: http://localhost:8080/health
- UI health check: http://localhost:3000

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Testing

The project includes comprehensive test coverage for both frontend and backend components.

### Backend Testing

The backend uses Jest and Supertest for testing. Tests are organized into:
- Unit tests (`*.spec.ts`)
- E2E tests (`test/*.e2e-spec.ts`)

Run backend tests:
```bash
cd api

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run E2E tests
npm run test:e2e
```

Coverage requirements:
- Minimum 80% coverage for all metrics
- Tests required for all new features/changes

### Frontend Testing

The frontend uses Jest and React Testing Library. Tests cover:
- Components
- Hooks
- Utils
- Integration tests

Run frontend tests:
```bash
cd ui

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests in CI mode
npm run test:ci
```

Coverage thresholds:
- Branches: 80%
- Functions: 80%
- Lines: 80%
- Statements: 80%

### Test Organization

#### Backend Tests
- `src/**/*.spec.ts`: Unit tests alongside source files
- `test/`: E2E tests
- Mocks in `src/__mocks__/`

#### Frontend Tests
- `src/**/*.test.tsx`: Component tests
- `src/**/*.test.ts`: Hook and utility tests
- `src/__tests__/`: Integration tests
- Mocks in `src/__mocks__/`

### Testing Best Practices

1. **Backend Testing**
   - Mock external services and databases
   - Test both success and error cases
   - Validate request/response schemas
   - Test edge cases and boundary conditions

2. **Frontend Testing**
   - Test user interactions
   - Verify component rendering
   - Test loading and error states
   - Mock API calls and external services
   - Test responsive behavior

3. **General Guidelines**
   - Write tests before fixing bugs
   - Keep tests focused and isolated
   - Use meaningful test descriptions
   - Follow AAA pattern (Arrange, Act, Assert)
   - Maintain test data fixtures
