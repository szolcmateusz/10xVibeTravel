# AI Rules for 10x-vibe-travel

VibeTravels is an application that enables planning engaging and interesting trips using artificial intelligence. The application allows users to create, edit, view, and delete travel plans, as well as manage their profile, including specifying travel preferences. A key element of the product is AI integration, which generates detailed trip plan suggestions based on selected criteria such as location, dates, and user preferences.

## Tech Stack
- Angular 19
- Supabase 

## AI
- OpenRouter.ai – An API platform enabling the integration of artificial intelligence features, such as content generation or data analysis. It allows the use of AI models.

## CI/CD
- Github Actions – A tool that automates CI/CD processes, enabling seamless code deployment, testing, and monitoring, allowing for quick responses to changes and maintaining high software quality.

## Hosting
- Azure Static Web Apps – A hosting service optimized for static applications, providing scalability, security, and easy integration with CI/CD systems, facilitating quick deployment and global access to the application.

## FRONTEND

### General Guidlines

When making changes to the project, take into account the division of functions and files by means of features. Each feature should be placed in `./src/app/features/` in a feature folder dedicated to it.

Each feature should contain a `routes.ts` file with routing configuration. Example:

``ts
export const EXAMPLE_FEATURE_ROUTES: Route[] = [
 {
 path: '',
 pathMatch: 'full',
 component: ExampleFeatureComponent,
 canActivate: [ /* ... */ ]
 }
];
```

Such a configuration file should be imported to `./src/app/app.routes.ts` with appropriate syntax for lazy loading: 
``ts
{
 path: 'example-feature',
 loadChildren: () => import('./example-feature/example-feature.routes').then(m => m.EXAMPLE_FEATURE_ROUTES),
 canActivate: [ /* ... */ ]
},
``

Additionally, if a given functionality should be used by 2 or more features, place such elements in the `shared/` folder.

For all other elements, use the standard rules and good practices for Angular, as well as the other rules I have provided to you.

### Guidelines for clean code

- Use feedback from linters to improve the code when making changes.
- Prioritize error handling and edge cases.
- Handle errors and edge cases at the beginning of functions.
- Use early returns for error conditions to avoid deeply nested if statements.
- Place the happy path last in the function for improved readability.
- Avoid unnecessary else statements; use if-return pattern instead.
- Use guard clauses to handle preconditions and invalid states early.
- Implement proper error logging and user-friendly error messages.
- Consider using custom error types or error factories for consistent error handling.

### Guidelines for ANGULAR

#### ANGULAR_CODING_STANDARDS

- Use standalone components, directives, and pipes instead of NgModules
- Implement signals for state management instead of traditional RxJS-based approaches
- Use the new inject function instead of constructor injection
- Implement control flow with @if, @for, and @switch instead of *ngIf, *ngFor, etc.
- Leverage functional guards and resolvers instead of class-based ones
- Use the new deferrable views for improved loading states
- Implement OnPush change detection strategy for improved performance
- Use TypeScript decorators with explicit visibility modifiers (public, private)
- Leverage Angular CLI for schematics and code generation
- Implement proper lazy loading with loadComponent and loadChildren
- Apply immutability principles and pure functions wherever possible, especially within services and state management, to ensure predictable outcomes and simplified debugging.
- Use descriptive variable names like `isUserLoggedIn`, `userPermissions`, and `fetchData()` to communicate intent clearly.
- Enforce kebab-case naming for files (e.g., `user-profile.component.ts`) and match Angular's conventions for file suffixes (e.g., `.component.ts`, `.service.ts`, etc.).
- Define data models using interfaces for explicit types and maintain strict typing to avoid `any`.
- Avoid using `any`; instead, use TypeScript's type system to define specific types and ensure code reliability and ease of refactoring.
- Use separate files to implement the components. One file should be the .html template of the component, while the other file should be the .ts class of the component.

#### ANGULAR_MATERIAL

- Create a dedicated module for Angular Material imports to keep the app module clean
- Use theme mixins to customize component styles instead of overriding CSS
- Implement OnPush change detection for performance critical components
- Leverage the CDK (Component Development Kit) for custom component behaviors
- Use Material's form field components with reactive forms for consistent validation UX
- Implement accessibility attributes and ARIA labels for interactive components
- Use the new Material 3 design system updates where available
- Leverage the Angular Material theming system for consistent branding
- Implement proper typography hierarchy using the Material typography system
- Use Angular Material's built-in a11y features like focus indicators and keyboard navigation

#### TAILWIND

- Use the @layer directive to organize styles into components, utilities, and base layers
- Implement Just-in-Time (JIT) mode for development efficiency and smaller CSS bundles
- Use arbitrary values with square brackets (e.g., w-[123px]) for precise one-off designs
- Leverage the @apply directive in component classes to reuse utility combinations
- Implement the Tailwind configuration file for customizing theme, plugins, and variants
- Use component extraction for repeated UI patterns instead of copying utility classes
- Leverage the theme() function in CSS for accessing Tailwind theme values
- Implement dark mode with the dark: variant
- Use responsive variants (sm:, md:, lg:, etc.) for adaptive designs
- Leverage state variants (hover:, focus:, active:, etc.) for interactive elements
- Do not use css custom classes, use predefined Tailwind classes instead.

### Guidelines for VERSION_CONTROL

#### GIT

- Use conventional commits to create meaningful commit messages
- Use feature branches with descriptive names following {{branch_naming_convention}}
- Write meaningful commit messages that explain why changes were made, not just what
- Keep commits focused on single logical changes to facilitate code review and bisection
- Use interactive rebase to clean up history before merging feature branches
- Leverage git hooks to enforce code quality checks before commits and pushes

#### CONVENTIONAL_COMMITS

- Follow the format: type(scope): description for all commit messages
- Use consistent types (feat, fix, docs, style, refactor, test, chore) across the project
- Define clear scopes based on {{project_modules}} to indicate affected areas
- Include issue references in commit messages to link changes to requirements
- Use breaking change footer (!: or BREAKING CHANGE:) to clearly mark incompatible changes
- Configure commitlint to automatically enforce conventional commit format

### Guidelines for STATIC_ANALYSIS

#### ESLINT

- Configure project-specific rules in eslint.config.js to enforce consistent coding standards
- Use shareable configs like eslint-config-airbnb or eslint-config-standard as a foundation
- Implement custom rules for {{project_specific_patterns}} to maintain codebase consistency
- Configure integration with Prettier to avoid rule conflicts for code formatting
- Use the --fix flag in CI/CD pipelines to automatically correct fixable issues
- Implement staged linting with husky and lint-staged to prevent committing non-compliant code

### Guidelines for UNIT

#### JEST

- Use Jest with TypeScript for type checking in tests
- Implement Testing Library for component testing instead of enzyme
- Use snapshot testing sparingly and only for stable UI components
- Leverage mock functions and spies for isolating units of code
- Implement test setup and teardown with beforeEach and afterEach
- Use describe blocks for organizing related tests
- Leverage expect assertions with specific matchers
- Implement code coverage reporting with meaningful targets
- Use mockResolvedValue and mockRejectedValue for async testing
- Leverage fake timers for testing time-dependent functionality

### Additional notes

- Use `yarn` instead of `npm` for all package-related commands.
- When not sure about a solution to a problem, just ask me for feedback