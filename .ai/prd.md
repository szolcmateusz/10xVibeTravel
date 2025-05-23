# Product Requirements Document (PRD) - VibeTravels

## 1. Product Overview
VibeTravels is an application that enables planning engaging and interesting trips using artificial intelligence. The application allows users to create, edit, view, and delete travel plans. A key element of the product is AI integration, which generates detailed trip plan suggestions based on selected criteria such as location, dates, and user preferences.

## 2. User Problem
Planning engaging and interesting trips is challenging. Users often don't know where to start or what elements to consider when organizing a trip. They lack a tool that combines information about preferences, time, and the number of people while leveraging AI's potential to generate a comprehensive travel plan. VibeTravels aims to simplify the planning process and increase user satisfaction by offering personalized and well-thought-out trip plans.

## 3. Functional Requirements
1. User Account System:
   - Registration of new users.
   - Login for existing users.
   - Secure access using JWT tokens and automatic token refresh every 1 hour with event logging for audit purposes.
2. Trip Plan Management:
   - Adding a new trip plan, where the user provides the location, trip dates, and selects travel preferences.
   - Reading, viewing, editing, and deleting saved trip plans.
3. AI Integration:
   - Generating a trip plan based on user input (location, dates, preferences).
   - The generation process must be manually initiated by the user.
4. Confirmation Popup:
   - After the AI generates a plan, the user receives a popup with options "Confirm" and "Cancel" along with a clear message that the confirmed plan cannot be edited.

## 4. Product Boundaries
- The functionality of sharing trip plans between accounts is not included in the MVP.
- The MVP does not include the ability to add multimedia (photos, videos) related to trips.
- Integration with Google Maps is not part of the MVP.
- The process of generating new AI plan suggestions after rejection is manually initiated by the user, not automatic.

## 5. User Stories

### US-001
ID: US-001  
Title: Registering a New User  
Description: The user must be able to create an account by providing necessary information such as email address, password, and other required details.  
Acceptance Criteria:
- The user fills out the registration form.
- The system validates the input data (email format correctness, password strength).
- After successful registration, the user receives confirmation at the provided email address.

### US-002
ID: US-002  
Title: Logging in an Existing User  
Description: The user must be able to log in to the system using registered credentials.  
Acceptance Criteria:
- The user enters valid login credentials.
- The system authorizes the user and generates a JWT token.
- After successful login, the user is redirected to the application's main page.

### US-003
ID: US-003 
Title: Adding a New Trip  
Description: The user creates a new trip by providing the location, dates, and selecting travel preferences.  
Acceptance Criteria:
- The form for creating a trip is easily accessible.
- The user must provide required data (location, dates, preferences).
- After saving the trip, a confirmation message is displayed, and the new trip appears on the list.

### US-004
ID: US-004 
Title: Generating a Trip Plan Using AI  
Description: The user initiates the process of generating a trip plan using the built-in AI function, which considers location, dates, and preferences.  
Acceptance Criteria:
- The user selects the option to generate a plan.
- The system sends a request to the AI module with the user's data.
- The generated trip plan is presented to the user for acceptance or rejection.

### US-005
ID: US-005
Title: Accepting or Rejecting a Trip Plan  
Description: After the AI generates a plan, the user decides whether to accept or reject it.  
Acceptance Criteria:
- After the plan is generated, a popup appears with options "Confirm" and "Cancel."
- The popup contains a clear message that the confirmed plan cannot be edited later.
- Accepting the plan saves the final version of the plan in the system.
- In case of rejection, the user can manually trigger a new plan generation.

### US-006
ID: US-006
Title: Editing and Deleting Trips  
Description: The user can edit or delete existing trip plans.  
Acceptance Criteria:
- The user has access to a list of their trips.
- In the detailed view of a trip, options for editing and deleting are available.
- Changes are saved and reflected in the system immediately.
- Deleting a trip requires confirmation of the operation.

### US-007
ID: US-007
Title: Automatic JWT Token Refresh  
Description: The system must automatically refresh the user's JWT token just before it expires to ensure session continuity and log events for audit purposes.  
Acceptance Criteria:
- The JWT token is set to expire after 1 hour.
- The system automatically refreshes the token before expiration.
- Each token refresh event is logged in the audit system.

### US-008
ID: US-008
Title: Listing of trip plans created  
Description: The user can view the trip plans he or she has created in the form of a list.
Acceptance Criteria:
- The user has access to a list of their trips.
- Trip plans are displayed in a paginated list.

### US-009
ID: US-009
Title: View details of created trip plan 
Description: The user can view details of the created trip plans.
Acceptance Criteria:
- The user has access to the details of the trip plan he or she has created.


## 6. Success Metrics
1. 90% of AI-generated trip plans must be accepted by users, measured by the number of "accept" button clicks.
2. 75% of users should generate at least 3 trip plans annually, monitored through the usage analytics system.
