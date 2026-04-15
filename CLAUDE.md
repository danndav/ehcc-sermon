# EHCC Plus Development Guide

## Monorepo Structure
```
apps/
├── api/          # NestJS backend (port 3005) — DDD architecture
├── web/          # Next.js 14 user-facing app (port 3000)
└── admin/        # Next.js 14 admin dashboard (port 3001)
```

## Backend (apps/api)

### Domain-Driven Design (DDD) Implementation
- Follow Domain-Driven Design principles
- Organize code into bounded contexts and subdomains
- Use ubiquitous language throughout the codebase (sermon, series, pastor, prayer, subscription, devotional, transcript, embedding)
- Implement rich domain models with business logic

### Subdomain Structure
```
apps/api/src/subdomains/
├── {subdomain-name}/
│   ├── api/                    # API layer (controllers, DTOs, middleware)
│   │   ├── api.module.ts
│   │   └── rest/
│   │       ├── controllers/
│   │       └── dto/
│   │           ├── input/
│   │           └── output/
│   ├── application/            # Application layer (services, factories)
│   │   ├── application.module.ts
│   │   ├── services/
│   │   ├── factories/
│   │   └── dto/
│   ├── domain/                 # Domain layer (entities, enums, read-models)
│   │   ├── entities/
│   │   ├── enums/
│   │   └── read-models/
│   ├── infrastructure/         # Infrastructure layer (repositories)
│   │   ├── infrastructure.module.ts
│   │   └── repositories/
│   └── {subdomain-name}.module.ts
```

### Current Subdomains
- **auth** — Registration, login, JWT, role management
- **branches** — Church branches (HQ, Lekki, Oshogbo, Ogbomosho, Abeokuta, UK, Canada, USA)
- **sermons** — Sermon CRUD, series, pastors, watch history, bookmarks, notes, verses (week/year)
- **prayer** — Prayer wall, prayer requests, prayer recordings, nightly prayer settings, prayer streaks
- **subscriptions** — Paystack integration, subscription plans, sermon purchases, discount codes, webhooks
- **ai** — Embedding generation, semantic search, spiritual guidance, auto-tagging, devotional generation
- **media** — Cloudflare R2 video storage, HLS transcoding pipeline, signed URLs, video cleanup
- **notifications** — Push (Firebase), email (Resend), in-app notifications

### Cross-Cutting Concerns (AOP Layer)
```
apps/api/src/aop/
├── authentication/     # Guards, middleware, decorators (AuthGuard, RolesGuard, @Roles, @Public)
├── context/            # Request context (UserContext, AdminContext, PublicContext)
├── db/                 # TypeORM setup, base entity (IEntity), migrations
├── filters/            # Global exception filter
├── observability/      # Logger, error reporter
├── queue/              # BullMQ queues (notification-dispatch, sermon-processing)
├── s3/                 # S3/R2 client for file storage (thumbnails, PDFs)
├── constants/          # Shared constants (IS_PUBLIC_KEY, JWT_SECRET)
└── open-api/           # Swagger setup
```

### Creating a New Subdomain
1. Create the subdomain directory structure
2. Implement layers in order:
   - Domain (entities extending IEntity, enums, read-models)
   - Infrastructure (repositories wrapping TypeORM, infrastructure.module.ts)
   - Application (services, factories, application.module.ts)
   - API (controllers with guards/decorators, input/output DTOs, api.module.ts)
3. Create the subdomain root module (imports ApplicationModule + ApiModule, exports ApplicationModule)
4. Register in `apps/api/src/root.module.ts`

### Layer Responsibilities

#### Domain Layer
- Define core business entities extending `IEntity` from `apps/api/src/aop/db/entities/entity.ts`
- Implement enums for domain-specific states and types
- Define read-model interfaces for query projections
- No external dependencies — pure domain logic

#### Infrastructure Layer
- Implement repositories wrapping TypeORM `Repository<Entity>`
- Register entities with `TypeOrmModule.forFeature([Entity])`
- Export repositories for the application layer
- Handle raw SQL for complex queries

#### Application Layer
- Implement services with business logic
- Use factories for entity creation and DTO transformation
- Coordinate between repositories
- Accept context objects (UserContext, AdminContext) for logging

#### API Layer
- Define REST controllers with `@ApiTags`, `@ApiOperation`, `@ApiResponse`
- Use `@UseGuards(AuthGuard, RolesGuard)` and `@Roles(RoleEnum.ADMIN)` for access control
- Use `@Public()` for unauthenticated endpoints (webhooks, public sermon browsing)
- Apply middleware in `ApiModule.configure()`: `checkAuthenticationToken` → `createUserContext`/`createAdminContext`
- Input DTOs use `class-validator` decorators; output DTOs use `@ApiProperty`

### Module Wiring Pattern
```typescript
// Subdomain root module
@Module({
  imports: [ApplicationModule, ApiModule],
  exports: [ApplicationModule],  // Export for cross-module use
})
export class MyModule {}

// Application module
@Module({
  imports: [InfrastructureModule],
  providers: [MyService],
  exports: [MyService],
})
export class ApplicationModule {}

// API module with middleware
@Module({
  imports: [ApplicationModule, AuthenticationModule],
  controllers: [MyController, MyAdminController],
})
export class ApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(checkAuthenticationToken, createAdminContext).forRoutes(MyAdminController);
    consumer.apply(checkAuthenticationToken, createUserContext).forRoutes(MyController);
  }
}
```

## Testing Guidelines

### Test Structure
```
apps/api/src/subdomains/{subdomain-name}/
├── application/
│   ├── factories/__tests__/     # Factory tests
│   └── services/__tests__/      # Service tests
├── domain/
│   └── entities/__mocks__/      # Entity mocks
└── infrastructure/
    └── repositories/__tests__/  # Repository tests
```

### Test File Naming Convention
- Test files: `{name}.test.ts` or `{name}.spec.ts`
- Mock files in `__mocks__` directories
- Test files mirror the source file structure

### Test Categories
1. **Unit Tests** — Test individual components in isolation with mocks. Use vitest.
2. **Integration Tests** — Test component interactions with test database, repository operations.
3. **E2E Tests** — Test complete workflows, API endpoints, auth flow, error scenarios.

## Database Migrations

### Location
`apps/api/src/aop/db/migrations/{timestamp}-{MigrationName}.ts`

### Best Practices
- Keep migrations atomic
- Always include both `up()` and `down()` methods
- Use `uuid_generate_v4()` for primary keys
- Create indexes for frequently queried columns
- Use PostgreSQL enums for fixed value sets
- Test migrations in development before deploying

## Code Style and Patterns

### Naming Conventions
- PascalCase for classes and interfaces
- camelCase for methods and variables
- UPPER_SNAKE_CASE for constants
- kebab-case for file names
- Entities: `{name}.entity.ts`, DTOs: `{name}.dto.ts`, Enums: `{name}.enum.ts`

### Roles
- `RoleEnum.GUEST` — Visitors browsing free sermons
- `RoleEnum.MEMBER` — Registered members with free access
- `RoleEnum.SUBSCRIBER` — Paid subscribers with premium access
- `RoleEnum.PRAYER_TEAM` — Prayer team members who can view private prayer requests
- `RoleEnum.ADMIN` — Church administrators with full access

### AI Integration Rules
- All AI features are strictly limited to sermon library content
- The AI must never give its own spiritual advice, biblical interpretation, or theological opinion
- Always attribute content to the pastor who preached it
- If no sermon matches a query, respond: "We don't have a sermon on that topic yet — check back soon."
- Use Claude API (claude-sonnet) for all AI features
- Use pgvector for sermon embeddings and semantic search

### Error Handling
- Use NestJS exceptions: `BadRequestException`, `NotFoundException`, `UnauthorizedException`
- Global exception filter catches unhandled errors and returns standardized responses
- Log errors with context via `context.logger.error()`

### Logging
- All services receive context (UserContext/AdminContext) with `traceId` and `logger`
- Format: `[TRACE_ID]: <uuid> [ADMIN] <message> <contextData>`

## Security Guidelines

### Authentication
- JWT access tokens (24h) + refresh tokens (7d)
- `@Public()` decorator for unauthenticated endpoints
- Webhook endpoints use Paystack signature verification instead of JWT

### Authorization
- Role-based: `@Roles(RoleEnum.ADMIN)` or `@Roles(RoleEnum.SUBSCRIBER)`
- Admin routes use `createAdminContext` middleware
- User routes use `createUserContext` middleware
- Public routes (sermon browsing) use `createPublicContext` middleware

### Data Protection
- Paystack webhook signature verification (HMAC SHA-512)
- Bunny.net signed URLs for paid video content — never expose raw CDN URLs
- Passwords hashed with bcrypt (12 rounds)

## Performance

### Database
- UUID primary keys with `uuid_generate_v4()`
- Indexes on foreign keys, status columns, and frequently filtered columns
- Partial indexes for targeted queries (e.g., unread notifications, published sermons)
- Soft deletes via `deleted_at` column

### API
- Pagination on all list endpoints (page/limit)
- Swagger/OpenAPI docs available in local/staging environments

## External Integrations
- **Payments**: Paystack (Nigeria), Stripe (international — Phase 2)
- **Video Storage**: Cloudflare R2 — self-hosted HLS pipeline, zero egress, signed URLs for paid content
- **Video Transcoding**: FFmpeg on DigitalOcean VPS — HLS 4-quality (1080p/720p/480p/360p), 6s segments
- **Video Player**: HLS.js — adaptive bitrate, quality selector, resume from progress
- **Transcription**: AssemblyAI or OpenAI Whisper
- **AI Engine**: Claude API (claude-sonnet) — recommendations, tagging, summaries, devotionals
- **Embeddings**: pgvector in PostgreSQL — semantic search
- **Email**: Resend — transactional emails
- **Push Notifications**: Firebase Cloud Messaging
- **Storage**: S3-compatible (Cloudflare R2) — thumbnails, PDFs, devotional downloads

## Deployment
- AWS Lambda via Serverless Framework
- PostgreSQL 16, Redis 7
- Docker for local development (`yarn db:docker`)
