# Workflow-Driven UI Design

The platform implements a strict workflow-driven UI.

Ticket Lifecycle:
SUBMITTED → FORWARDED_TO_MANAGEMENT → ACTION_TAKEN → CLOSED / REVERIFY

## Role Responsibilities
- Operations: Raise ticket
- Leadership: Review and comment
- Management: Take action
- Auditor: Final decision

## UI Behavior
- UI actions are enabled/disabled based on status
- Timeline component shows current workflow stage
- Forms are conditionally injected based on role and status

## Timeline View
Each ticket displays:
- Submission stage
- Leadership review
- Management action
- Auditor decision

Rejected and Reverify states are visually highlighted.

This ensures:
- Clear process visibility
- No invalid transitions
- Enterprise-grade workflow enforcement
