# News Aggregator API Documentation

## Base URL
`http://localhost:8080`

## Authentication
Currently, the API is open and does not require authentication.

## Endpoints

### Articles

#### List Articles
```http
GET /articles
```

Query Parameters:
- `page` (number, default: 1): Page number
- `limit` (number, default: 10): Items per page
- `categories` (string[]): Filter by categories
- `search` (string): Search in title and content

Response:
```json
{
  "articles": [
    {
      "id": 1,
      "title": "Article Title",
      "content": "Article content...",
      "url": "https://source.com/article",
      "imageUrl": "https://source.com/image.jpg",
      "source": "Source Name",
      "author": "Author Name",
      "categories": ["technology", "ai"],
      "createdAt": "2024-01-03T21:00:00.000Z"
    }
  ],
  "total": 100,
  "page": 1,
  "totalPages": 10
}
```

#### Get Article
```http
GET /articles/:id
```

Response:
```json
{
  "id": 1,
  "title": "Article Title",
  "content": "Article content...",
  "url": "https://source.com/article",
  "imageUrl": "https://source.com/image.jpg",
  "source": "Source Name",
  "author": "Author Name",
  "categories": ["technology", "ai"],
  "createdAt": "2024-01-03T21:00:00.000Z"
}
```

### Newsletter

#### Subscribe
```http
POST /newsletter/subscribe
```

Request Body:
```json
{
  "email": "user@example.com",
  "topics": ["technology", "ai"],
  "frequency": "daily"
}
```

Response:
```json
{
  "message": "Successfully subscribed to newsletter",
  "id": 1
}
```

#### Unsubscribe
```http
DELETE /newsletter/unsubscribe/:email
```

Response:
```json
{
  "message": "Successfully unsubscribed from newsletter"
}
```

### Analytics

#### Record View
```http
POST /analytics/view
```

Request Body:
```json
{
  "articleId": 1
}
```

Response:
```json
{
  "message": "View recorded successfully"
}
```

#### Record Share
```http
POST /analytics/share
```

Request Body:
```json
{
  "articleId": 1,
  "platform": "twitter"
}
```

Response:
```json
{
  "message": "Share recorded successfully"
}
```

### User Preferences

#### Get Preferences
```http
GET /preferences
```

Response:
```json
{
  "itemsPerPage": 10,
  "theme": "dark",
  "preferredCategories": ["technology", "science"],
  "emailNotifications": true
}
```

#### Update Preferences
```http
PUT /preferences
```

Request Body:
```json
{
  "itemsPerPage": 20,
  "theme": "light",
  "preferredCategories": ["technology", "ai"],
  "emailNotifications": false
}
```

Response:
```json
{
  "message": "Preferences updated successfully"
}
```

## WebSocket Events

### Connection
```javascript
const socket = new WebSocket('ws://localhost:8080/articles');
```

### Events

#### New Article
```json
{
  "type": "newArticle",
  "data": {
    "id": 1,
    "title": "New Article",
    "categories": ["technology"]
  }
}
```

#### Trending Update
```json
{
  "type": "trendingUpdate",
  "data": {
    "articles": [
      {
        "id": 1,
        "title": "Trending Article",
        "views": 1000
      }
    ]
  }
}
```

## Error Handling

The API uses standard HTTP status codes:
- 200: Success
- 400: Bad Request
- 404: Not Found
- 500: Internal Server Error

Error Response Format:
```json
{
  "statusCode": 400,
  "message": "Error message here",
  "error": "Bad Request"
}
```

## Rate Limiting

The API implements rate limiting:
- 100 requests per minute per IP
- WebSocket connections limited to 1 per client

## Data Models

### Article
```typescript
interface Article {
  id: number;
  title: string;
  content: string;
  url: string;
  imageUrl?: string;
  source: string;
  author?: string;
  categories: string[];
  createdAt: Date;
}
```

### NewsletterSubscriber
```typescript
interface NewsletterSubscriber {
  id: number;
  email: string;
  topics: string[];
  frequency: 'daily' | 'weekly';
  isActive: boolean;
  createdAt: Date;
}
```

### UserPreferences
```typescript
interface UserPreferences {
  id: number;
  itemsPerPage: number;
  theme: 'light' | 'dark';
  preferredCategories: string[];
  emailNotifications: boolean;
}
```

### Analytics
```typescript
interface ArticleAnalytics {
  articleId: number;
  views: number;
  shares: number;
  bookmarks: number;
  lastUpdated: Date;
}
``` 