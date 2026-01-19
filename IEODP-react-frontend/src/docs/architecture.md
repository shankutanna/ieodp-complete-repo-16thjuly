# Frontend Architecture – IEODP Platform

The IEODP frontend is designed using a modular, role-driven, and config-driven architecture.

High-level structure:

UI Layer (React Components)
        |
        v
Layout Layer (MainLayout, Sidebar, ProtectedRoute)
        |
        v
Feature Modules (Operations, Management, Leadership, Auditors, Admin)
        |
        v
State Layer (Redux Toolkit Slices + RTK Query APIs)
        |
        v
API Layer (RTK Query Base API)
        |
        v
Backend Services (Auth, Tickets, Users, Audit Logs, Workflows)

Key Architecture Principles:
- Feature-based module separation
- Role-driven navigation and rendering
- Config-driven dashboards
- Centralized API management via RTK Query
- Strict separation of UI, state, and business logic

Each role (Operations, Management, Leadership, Auditor, Admin) operates in its own module with shared core components and centralized state.
