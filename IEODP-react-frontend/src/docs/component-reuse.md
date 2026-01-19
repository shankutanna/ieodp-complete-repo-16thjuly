# Component Reuse Strategy

The application follows a layered component reuse approach.

## Base Components
Reusable base components:
- BaseWidget (dashboard container)
- Button, Input, Select (DaisyUI based)
- Modal, Badge, Card

These components handle layout and styling consistency.

## Feature Components
Feature-specific reusable components:
- TicketCard
- UserRow
- AuditTimeline
- WorkflowTimeline

These components are reused across multiple roles with role-based behavior.

## Form Components
Reusable form components:
- LeadershipCommentForm
- ManagementActionForm
- AuditorDecisionForm

These forms are injected conditionally based on role and ticket status.

## Dashboard Widgets
Widgets are fully config-driven:
- KPIWidget
- PieChartWidget
- BarChartWidget
- LineChartWidget

The DashboardRenderer dynamically renders widgets based on role configuration.

This strategy ensures:
- Minimal duplication
- Consistent UI behavior
- Easy scalability
- Centralized styling
