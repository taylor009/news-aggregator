# Component Interaction Diagram

```mermaid
graph TD
    subgraph Frontend Components
        Page[Next.js Page]
        ArticleList[Article List]
        ArticleCard[Article Card]
        Hooks[Custom Hooks]
    end

    subgraph Backend Modules
        NewsModule[News Module]
        ArticlesModule[Articles Module]
        SchedulerModule[Scheduler Module]
        WebSocketModule[WebSocket Module]
    end

    subgraph Services
        NewsService[News Service]
        ArticlesService[Articles Service]
        NewsScheduler[News Scheduler]
        ArticlesGateway[Articles Gateway]
    end

    subgraph Database
        ArticleEntity[Article Entity]
        TypeORM[TypeORM]
    end

    Page --> ArticleList
    ArticleList --> ArticleCard
    Page --> Hooks
    Hooks -->|WebSocket| ArticlesGateway
    Hooks -->|HTTP| ArticlesModule

    NewsModule --> NewsService
    ArticlesModule --> ArticlesService
    SchedulerModule --> NewsScheduler
    WebSocketModule --> ArticlesGateway

    NewsScheduler -->|Schedule| NewsService
    NewsService -->|Create| ArticlesService
    ArticlesService -->|Save| TypeORM
    TypeORM -->|Map| ArticleEntity
    ArticlesGateway -->|Emit| Hooks
```

## Component Details

1. **Frontend Components**
   - `Page`: Next.js pages for routing and layout
   - `ArticleList`: Main component for displaying articles
   - `ArticleCard`: Individual article display
   - `Hooks`: Custom hooks for data fetching and real-time updates

2. **Backend Modules**
   - `NewsModule`: Handles news fetching and processing
   - `ArticlesModule`: Manages article storage and retrieval
   - `SchedulerModule`: Manages scheduled tasks
   - `WebSocketModule`: Handles real-time updates

3. **Services**
   - `NewsService`: Fetches articles from News API
   - `ArticlesService`: CRUD operations for articles
   - `NewsScheduler`: Schedules periodic article updates
   - `ArticlesGateway`: WebSocket gateway for real-time updates

4. **Database**
   - `ArticleEntity`: TypeORM entity for articles
   - `TypeORM`: Database ORM for SQLite 