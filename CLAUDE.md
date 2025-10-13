# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a monorepo with multiple applications for business model development and content creation tools:

- **businessmodelfirst.com**: Business model development platform with Next.js web frontend and Tauri desktop app
- **narzedziadlatworcow.pl**: Content creation tools platform with context-driven Arc framework architecture

## Common Development Commands

### Root Level Commands
```bash
# Install dependencies
bun install

# Run specific app commands
bun run app:web          # businessmodelfirst.com web development
bun run app:server       # businessmodelfirst.com server
bun run app:platform     # businessmodelfirst.com platform app

# Arc framework management
bun run arc:link         # Link local Arc framework packages
bun run arc:unlink       # Unlink Arc framework packages
bun run arc:remove       # Remove Arc framework packages
```

### Application-Specific Commands

#### businessmodelfirst.com/web (Next.js)
```bash
cd apps/businessmodelfirst.com/web
bun run dev              # Development server with Turbopack
bun run build            # Production build
bun run start            # Production server
bun run lint             # ESLint
```

#### businessmodelfirst.com/platform (Tauri + React)
```bash
cd apps/businessmodelfirst.com/platform
bun run dev              # Vite development server
bun run build            # Production build
bun run tauri dev        # Tauri development with native app
bun run tauri build      # Build native app
```

#### narzedziadlatworcow.pl/platform (Tauri + React)
```bash
cd apps/narzedziadlatworcow.pl/platform
bun run dev              # Vite development server
bun run build            # Production build
bun run tauri dev        # Tauri development with native app
```

#### narzedziadlatworcow.pl/ui (Component Library)
```bash
cd apps/narzedziadlatworcow.pl/ui
bun run lint             # ESLint
bun run typecheck        # TypeScript type checking
```

#### narzedziadlatworcow.pl/context (Arc Framework)
```bash
cd apps/narzedziadlatworcow.pl/context
# Arc framework automatically builds on changes
# No manual build commands needed
```

#### narzedziadlatworcow.pl/server (Bun Backend)
```bash
cd apps/narzedziadlatworcow.pl/server
bun run dev              # Development server with watch mode
bun run build            # Build for production
bun run start            # Start production server
```

## Architecture Overview

### businessmodelfirst.com
- **Web App**: Next.js 15 with TailwindCSS, TypeScript
- **Platform App**: Tauri desktop application with React frontend
- **Server**: Bun-based backend with TypeScript
- **Database**: SQL-based with business model data structures

### narzedziadlatworcow.pl
- **Architecture**: Arc Framework (Event-Driven Architecture)
- **Frontend**: React with Tauri for desktop, Vite for web
- **Backend**: Bun server with Arc framework integration
- **Database**: Views automatically generated from events

## Arc Framework Architecture (narzedziadlatworcow.pl)

The narzedziadlatworcow.pl application uses the Arc framework with event-driven architecture:

### Core Components
- **Commands**: Handle user actions, validate input, emit events (`/context/commands/`)
- **Events**: Immutable facts about what happened (`/context/events.ts`)
- **Listeners**: React to events, handle side effects like AI processing (`/context/listeners/`)
- **Views**: Read models that auto-update from events (`/context/views/`)

### Key Patterns
- **Schema-First**: All types generated from Arc schema definitions
- **Event Flow**: Commands → Events → Listeners → Views
- **Authentication**: `ctx.$auth.userId` available in commands and views
- **Credit System**: Check `ctx.credits.findOne()` before expensive operations
- **AI Integration**: OpenAI API calls in listeners, not commands

### File Organization
```
/apps/narzedziadlatworcow.pl/context/
├── arc.config.json          # Arc configuration
├── events.ts               # All domain events
├── commands/               # Command handlers (kebab-case)
├── listeners/              # Event listeners (kebab-case)
├── views/                  # Read models (kebab-case)
├── objects/                # Reusable schema objects
└── utils/                  # Helper functions
```

### Context Modules
- **Main Context**: User management, scenarios, credits (`/context/index.ts`)
- **Account Workspace**: Team/workspace management (`/context/account-workspace/`)
- **Content Context**: Content and idea management (`/context/content/`)
- **Strategy Context**: Content strategy tools (`/context/strategy/`)
- **Ordering Context**: Payment and order processing (`/context/ordering/`)

## Technology Stack

### Frontend
- **React**: 19.x with TypeScript
- **Routing**: React Router DOM v7
- **Styling**: TailwindCSS v4
- **UI Components**: Custom component library in `/ui` workspace
- **Desktop**: Tauri v2 for native apps

### Backend
- **Runtime**: Bun (preferred over Node.js)
- **Framework**: Arc Framework for event-driven architecture
- **Database**: SQL with automatic view generation
- **Authentication**: JWT with custom auth context
- **Payments**: Stripe integration
- **AI**: OpenAI API integration

### Development Tools
- **Build**: Vite for frontend, Bun for backend
- **Language**: TypeScript 5.6+
- **Package Manager**: Bun workspaces
- **Linting**: ESLint with Next.js config

## Development Workflow

### Working with Arc Framework
1. **Define Events**: Add new events to `/context/events.ts`
2. **Create Commands**: Add command handlers in `/context/commands/`
3. **Add Listeners**: Create event listeners in `/context/listeners/`
4. **Update Views**: Modify or create read models in `/context/views/`
5. **Frontend Integration**: Use Arc React hooks in components

### Key Development Notes
- Use `revalidate()` after mutations to refresh views
- Always add `type="button"` to non-submit buttons in forms
- Handle union return types from commands properly
- Check existing patterns before creating new ones
- Follow kebab-case naming for Arc framework files

### Testing
- Test commands for validation and event emission
- Test listeners for proper event handling
- Test views for correct data transformations
- Use Arc framework's built-in testing utilities

## Environment Configuration

### Required Environment Variables
- `OPENAI_API_KEY`: For AI content generation
- `STRIPE_SECRET_KEY`: For payment processing
- `JWT_SECRET`: For authentication
- `SMTP_CONFIG`: For email notifications
- `DATABASE_URL`: For database connections

### Development Setup
1. Install Bun runtime
2. Clone repository and run `bun install`
3. Configure environment variables
4. Run development servers per application

## Deployment

### Production Commands
```bash
# Build all applications
bun run build

# Deploy script (configured per app)
./deploy.sh
```

### Infrastructure
- **Containerization**: Docker with Caddy reverse proxy
- **Orchestration**: Docker Compose for multi-service deployment
- **Infrastructure as Code**: Terraform configuration in `/infra/`
- **Server Management**: Ansible playbooks for server setup

## Important Implementation Details

### Arc Framework Best Practices
- Use existing enums from `/objects/` directory
- Follow auth patterns with `ctx.$auth.userId`
- Handle credit system checks before expensive operations
- Use metadata in views to store configuration (style, tone, duration)
- Handle errors gracefully with fallback responses

### UI/UX Patterns
- Shared UI components in `/ui` workspace
- Consistent styling with TailwindCSS
- Responsive design for web and desktop
- Form validation with schema-driven approach

### Performance Considerations
- Arc framework provides automatic optimizations
- Views update in real-time from events
- Efficient credit system for AI operations
- Proper error handling and user feedback