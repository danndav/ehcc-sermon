# Preppod Backend

A modern, scalable learning management platform built with NestJS, TypeScript, and Domain-Driven Design principles.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Development](#development)
- [Testing](#testing)
- [API Documentation](#api-documentation)
- [Database](#database)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

Preppod is a comprehensive learning management system that provides:

- **User Management**: Authentication, authorization, and user profiles
- **Course Management**: Course creation, management, and publishing
- **Content Management**: Lessons, modules, and multimedia content
- **Enrollment System**: Student enrollment and progress tracking
- **Assessment Tools**: Quizzes, projects, and evaluations
- **Payment Integration**: Stripe payment processing
- **Progress Tracking**: Detailed learning analytics
- **Notification System**: Email and in-app notifications

## 🏗️ Architecture

### Domain-Driven Design (DDD)

The application follows Domain-Driven Design principles with clear bounded contexts:

```
src/subdomains/
├── user-management/     # User authentication, profiles, roles
├── course-management/   # Course creation and management
├── course-modules/      # Course structure and modules
├── lessons/            # Individual lesson content
├── enrollments/        # Student enrollment system
├── progress-tracking/  # Learning progress analytics
├── quiz/              # Assessment and evaluation
├── projects/          # Project-based learning
├── payment/           # Payment processing
├── transactions/      # Financial transactions
├── notifications/     # Communication system
├── categories/        # Content categorization
├── metrics/           # Analytics and reporting
├── iam/              # Identity and access management
└── generic/          # Shared utilities and views
```

### Layered Architecture

Each subdomain follows a clean layered architecture:

- **API Layer**: Controllers, DTOs, and request/response handling
- **Application Layer**: Services, factories, and business logic
- **Infrastructure Layer**: Repositories, external services, and data access
- **Domain Layer**: Entities, value objects, and domain logic

## 🛠️ Technology Stack

### Core Technologies
- **Framework**: NestJS 10.x
- **Language**: TypeScript 5.x
- **Runtime**: Node.js 18.x
- **Database**: PostgreSQL 15.x
- **ORM**: TypeORM 0.3.x

### Cloud & Infrastructure
- **Platform**: AWS Lambda (Serverless)
- **Storage**: AWS S3
- **Monitoring**: AWS CloudWatch, Sentry
- **Deployment**: Serverless Framework

### Development Tools
- **Testing**: Vitest
- **Linting**: ESLint
- **Formatting**: Prettier
- **Package Manager**: Yarn 4.x

### External Services
- **Payment**: Stripe
- **Email**: Courier
- **Authentication**: Google OAuth 2.0
- **File Storage**: AWS S3

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: 18.x or higher
- **Yarn**: 4.x or higher
- **Docker**: For local database
- **AWS CLI**: For deployment (optional)
- **PostgreSQL**: 15.x or higher

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd preppod-backend
```

### 2. Install Dependencies

```bash
yarn install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
# Database
TYPEORM_URL=postgres://preppod:password@localhost:5577/preppod

# Authentication
JWT_SECRET=your-jwt-secret-key
ADMIN_API_KEY=your-admin-api-key

# External Services
STRIPE_SECRET_KEY=your-stripe-secret-key
COURIER_AUTH_TOKEN=your-courier-auth-token
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# AWS Configuration
AWS_BUCKET_REGION=us-east-1
AWS_ASSETS_BUCKET_NAME=your-s3-bucket-name
CDN_URL=your-cdn-url

# Email Templates
VERIFICATION_EMAIL_TEMPLATE_ID=your-verification-template-id
PASSWORD_RESET_EMAIL_TEMPLATE_ID=your-password-reset-template-id
ADMIN_INVITE_EMAIL_TEMPLATE_ID=your-admin-invite-template-id

# URLs
GOOGLE_CALLBACK_URL=http://localhost:3005/api/v1/auth/google/callback
LEARNER_DASHBOARD_URL=http://localhost:3000
```

### 4. Start Local Database

```bash
# Start PostgreSQL with Docker
yarn db:start

# Or manually start PostgreSQL on port 5577
```

### 5. Run Database Migrations

```bash
yarn db:migrations
```

### 6. Start Development Server

```bash
yarn start:local
```

The API will be available at `http://localhost:3005/api/v1`

## 💻 Development

### Available Scripts

```bash
# Development
yarn start:local          # Start with hot reload
yarn start:ci            # Start for CI environment
yarn stop                # Stop development server

# Database
yarn db:start            # Start PostgreSQL with Docker
yarn db:stop             # Stop PostgreSQL
yarn db:migrations       # Run database migrations
yarn db:seed             # Seed database with sample data
yarn db:populate         # Run migrations and seed

# Testing
yarn test                # Run unit tests
yarn test:ci            # Run tests with coverage
yarn test:coverage-ui   # Run tests with coverage UI

# Code Quality
yarn lint                # Run ESLint
yarn lint:fix           # Fix ESLint issues
yarn prettier           # Format code with Prettier
yarn scan               # Build, lint, format, and test

# TypeORM
yarn typeorm:generate   # Generate new migration
yarn typeorm:run        # Run migrations
yarn typeorm:revert     # Revert last migration
yarn typeorm:show       # Show migration status

# Deployment
yarn deploy:dev         # Deploy to development
yarn deploy:prod        # Deploy to production
```

### Code Structure

```
src/
├── aop/                    # Cross-cutting concerns
│   ├── authentication/     # Auth guards and middleware
│   ├── context/           # Request context management
│   ├── db/                # Database configuration
│   ├── filters/           # Exception filters
│   ├── guards/            # Authorization guards
│   ├── observability/     # Logging and monitoring
│   └── s3/                # File storage
├── subdomains/            # Business domains
│   ├── user-management/   # User domain
│   ├── course-management/ # Course domain
│   └── ...               # Other domains
├── index.ts              # Application entry point
├── nest.ts               # NestJS bootstrap
└── root.module.ts        # Root module
```

### Development Guidelines

#### Creating a New Subdomain

1. Create the subdomain directory structure:
```bash
mkdir -p src/subdomains/new-domain/{api,application,infrastructure,domains}
```

2. Implement layers in order:
   - Domain (entities, enums, interfaces)
   - Infrastructure (repositories, external services)
   - Application (services, factories)
   - API (controllers, DTOs)

3. Create the subdomain module and register in `root.module.ts`

#### Naming Conventions

- **Files**: kebab-case (e.g., `user-profile.controller.ts`)
- **Classes**: PascalCase (e.g., `UserProfileController`)
- **Methods/Variables**: camelCase (e.g., `getUserProfile`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `JWT_SECRET`)

#### Code Style

- Use TypeScript strict mode
- Follow ESLint and Prettier configurations
- Write meaningful commit messages
- Add JSDoc comments for public APIs

## 🧪 Testing

### Test Structure

```
src/subdomains/{subdomain}/
├── api/__tests__/           # Controller tests
├── application/__tests__/   # Service tests
├── infrastructure/__tests__/ # Repository tests
└── domains/__tests__/       # Entity tests
```

### Running Tests

```bash
# Run all tests
yarn test

# Run tests with coverage
yarn test:ci

# Run tests in watch mode
yarn test --watch

# Run specific test file
yarn test path/to/test-file.test.ts
```

### Test Coverage

Current test coverage is low and needs improvement. Focus on:

1. **Unit Tests**: Test individual services and factories
2. **Integration Tests**: Test repository operations
3. **E2E Tests**: Test complete user workflows

## 📚 API Documentation

### Base URL
- **Development**: `http://localhost:3005/api/v1`
- **Production**: `https://api.preppod.com/api/v1`

### Authentication

The API uses JWT Bearer tokens for authentication:

```bash
Authorization: Bearer <your-jwt-token>
```

### Available Endpoints

#### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/verify-token` - Verify JWT token
- `POST /auth/google` - Google OAuth login

#### User Management
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user profile
- `GET /users/admin` - Admin user management

#### Course Management
- `GET /courses` - List courses
- `POST /courses` - Create course (Admin)
- `GET /courses/:id` - Get course details
- `PUT /courses/:id` - Update course (Admin)

#### Enrollments
- `POST /enrollments` - Enroll in course
- `GET /enrollments` - List user enrollments
- `GET /enrollments/:id` - Get enrollment details

### API Documentation

When running in development mode, Swagger documentation is available at:
`http://localhost:3005/api/v1/docs`

## 🗄️ Database

### Schema Overview

The database uses PostgreSQL with the following main entities:

- **users** - User accounts and profiles
- **courses** - Course information
- **course_modules** - Course structure
- **lessons** - Individual lesson content
- **enrollments** - Student course enrollments
- **progress_tracking** - Learning progress
- **transactions** - Payment transactions
- **categories** - Content categorization

### Migrations

```bash
# Generate new migration
yarn typeorm:generate src/aop/db/migrations/MigrationName

# Run migrations
yarn typeorm:run

# Revert last migration
yarn typeorm:revert

# Show migration status
yarn typeorm:show
```

### Database Management

```bash
# Start database with Docker
yarn db:start

# Stop database
yarn db:stop

# Reset database (migrations + seed)
yarn db:populate
```

## 🚀 Deployment

### Prerequisites

1. AWS Account with appropriate permissions
2. AWS CLI configured
3. Serverless Framework installed globally

### Environment Setup

1. Configure AWS credentials:
```bash
aws configure
```

2. Set up environment variables for each stage:
```bash
# Development
yarn deploy:dev

# Production
yarn deploy:prod
```

### Deployment Process

1. **Build**: TypeScript compilation
2. **Package**: Create deployment package
3. **Deploy**: Upload to AWS Lambda
4. **Database**: Run migrations on target environment

### Environment Variables

Ensure all required environment variables are set in AWS Systems Manager Parameter Store or environment configuration.

## 🤝 Contributing

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Pull Request Guidelines

- Write clear, descriptive commit messages
- Include tests for new functionality
- Update documentation as needed
- Ensure all tests pass
- Follow the existing code style

### Code Review Process

1. Automated checks (linting, tests)
2. Code review by team members
3. Approval and merge

## 🔧 Troubleshooting

### Common Issues

#### Node.js Version Issues
```bash
# Ensure you're using Node.js 18+
node --version

# If using nvm, switch to Node.js 18
nvm use 18
```

#### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Restart database
yarn db:stop && yarn db:start
```

#### Port Conflicts
```bash
# Check what's using port 3005
lsof -i :3005

# Kill process if needed
kill -9 <PID>
```

#### Test Failures
```bash
# Clear test cache
yarn test --clearCache

# Run tests with verbose output
yarn test --reporter=verbose
```

### Getting Help

- Check the [Issues](../../issues) page for known problems
- Create a new issue with detailed information
- Contact the development team

## 📄 License

This project is proprietary and confidential. All rights reserved.

## 👥 Team

- **Backend Team** - Core development
- **DevOps Team** - Infrastructure and deployment
- **QA Team** - Testing and quality assurance

---

**Note**: This is a learning management platform backend. For frontend applications, see the respective frontend repositories.



