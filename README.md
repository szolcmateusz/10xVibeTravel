# 10x-Vibe-Travel

## Table of Contents
- [Project Description](#project-description)
- [Tech Stack](#tech-stack)
- [Getting Started Locally](#getting-started-locally)
- [Available Scripts](#available-scripts)
- [Project Scope](#project-scope)
- [Project Status](#project-status)
- [License](#license)

## Project Description
10x-Vibe-Travel (VibeTravels) is an application designed to simplify trip planning by leveraging artificial intelligence to generate detailed and personalized travel plans. Users can register, log in, manage their profile (including setting travel preferences), and create, view, edit, or delete trip plans. A key feature is the integration with AI (via OpenRouter.ai) which provides unique trip plan suggestions based on user-selected criteria such as location, dates, and preferences.

## Tech Stack
- **Frontend:** Angular 19, Angular Material Design 3, Tailwind CSS 4
- **Backend:** Supabase
- **AI Integration:** OpenRouter.ai
- **CI/CD:** GitHub Actions
- **Hosting:** Azure Static Web Apps

## Getting Started Locally
### Prerequisites
- [Node.js](https://nodejs.org/) (version **22.14.0** as specified in the `.nvmrc`)
- [Yarn](https://yarnpkg.com/) package manager

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/10x-vibe-travel.git
   cd 10x-vibe-travel
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Start the development server:
   ```bash
   yarn start
   ```

## Available Scripts
The following commands are available in the project:

- **Start the development server:**
  ```bash
  yarn start
  ```

- **Build the project:**
  ```bash
  yarn build
  ```

- **Watch for file changes (development mode):**
  ```bash
  yarn watch
  ```

- **Run tests with Vitest:**
  ```bash
  yarn test
  ```

- **Run tests with coverage reporting:**
  ```bash
  yarn test:coverage
  ```

- **Run tests in watch mode:**
  ```bash
  yarn test:watch
  ```

- **Run tests in CI mode:**
  ```bash
  yarn test:ci
  ```

- **Lint the project:**
  ```bash
  yarn lint
  ```

- **Automatically fix lint issues:**
  ```bash
  yarn lint:fix
  ```

## Project Scope
The MVP of 10x-Vibe-Travel includes:

- **User Account System:** Registration, login, profile management, and secure JWT authentication with automatic token refresh.
- **Trip Plan Management:** Create, edit, view, and delete travel plans.
- **AI Integration:** Generate trip plans using user input (location, dates, preferences) with manual initiation.
- **Confirmation Popup:** Users receive a confirmation prompt when an AI-generated plan is presented, indicating that a confirmed plan cannot be edited.
- **User Preference Management:** Manage travel preferences including options like Cultural Tourism, Nature and Ecotourism, Relaxation Tourism, Adventure and Active Tourism, Gastronomic Tourism, and Health and Wellness Tourism.

## Project Status
The project is under active development. Core functionalities such as user management, trip planning, and AI integration are implemented as defined in the requirements document. Future work will include refining the AI-generated plans and further enhancements based on user feedback.

## License
This project is licensed under the MIT License.