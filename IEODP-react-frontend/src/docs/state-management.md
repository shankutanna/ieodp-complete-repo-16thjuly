# State Management Strategy

The application uses Redux Toolkit as the central state management solution, combined with RTK Query for all API communication.

## Global State
Global state is used only for:
- Authentication (user, role, token)
- UI layout state (sidebar open/close)
- Session-level information

This state is stored in:
- authSlice
- uiSlice

## Server State
All server data is managed using RTK Query:
- ticketsApi
- usersApi
- auditApi
- operationsApi
- managementApi

RTK Query handles:
- Caching
- Background refetching
- Loading and error states
- Optimistic updates
- Automatic revalidation

## Local State
Local component state is used only for:
- Form inputs
- Filters
- Pagination
- UI toggles

This separation ensures:
- Predictable data flow
- Minimal re-renders
- Scalable state architecture

The state design follows:
Global State → Session concerns  
Server State → API data  
Local State → Component concerns
