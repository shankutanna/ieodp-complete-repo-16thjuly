# Security & Permission Handling

## Authentication
- Login and Registration implemented using React Hook Form + Zod
- Token-based authentication pattern is used
- Tokens are stored in Redux state (backend-ready for secure storage)
- Session invalidation supported via logout

## Authorization
The system supports the following roles:
- ADMIN
- OPERATIONS
- MANAGEMENT
- LEADERSHIP
- AUDITORS

## Role-Based Access Control
- Routes are protected using ProtectedRoute component
- Each route declares allowedRoles
- Unauthorized access redirects to Unauthorized page

## Permission-Driven UI
- Sidebar menu is rendered based on role
- Dashboard widgets are loaded based on role config
- Actions (comment, approve, reject) are shown only when role + status match

## Component-Level Control
Example:
- Only Leadership can see LeadershipCommentForm
- Only Management can see ManagementActionForm
- Only Auditors can see AuditorDecisionForm

This ensures:
- Zero unauthorized actions
- Clear separation of responsibility
- Secure workflow progression
