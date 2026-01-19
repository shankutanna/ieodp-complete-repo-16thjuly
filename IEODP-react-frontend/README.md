# Intelligent Enterprise Operations & Decision Platform (IEODP)

> A production-grade, role-driven enterprise workflow platform built with React, Redux Toolkit, RTK Query, and DaisyUI.

---

## 🚀 Project Overview

The **Intelligent Enterprise Operations & Decision Platform (IEODP)** is an enterprise-grade frontend application designed to manage complex operational workflows, enforce governance and auditability, and support multi-role collaboration.

This project simulates real-world enterprise systems such as **ServiceNow, SAP Workflow, JIRA Service Management** and is built as part of a high-difficulty frontend engineering assessment.

---

## 🎯 Key Objectives

* Role-based workflow management
* Config-driven dashboards
* Multi-step approval and reverify loops
* Full audit trail & timeline
* Secure, permission-driven UI
* Scalable architecture

---

## 🧑‍💼 Supported Roles

| Role           | Responsibility                          |
| -------------- | --------------------------------------- |
| **Admin**      | User management, role assignment        |
| **Operations** | Raise tickets, add clarification        |
| **Leadership** | Review & comment                        |
| **Management** | Take corrective action                  |
| **Auditors**   | Final decision, approve/reject/reverify |

---

## 🔄 Workflow Design

Ticket lifecycle:

```
SUBMITTED → FORWARDED_TO_MANAGEMENT → ACTION_TAKEN → CLOSED
                   ↑
                 REVERIFY
```

When an auditor selects **REVERIFY**, the workflow loops back allowing Operations, Leadership, and Management to add additional information. All updates are appended to history without deleting previous data.

---

## 🏗️ Architecture

```
UI Components
     ↓
Layout (MainLayout, Sidebar, ProtectedRoute)
     ↓
Feature Modules (Operations, Management, Leadership, Audits, Admin)
     ↓
Redux Toolkit + RTK Query
     ↓
Backend APIs (JSON Server / Future Backend)
```

* Feature-based modular structure
* Centralized API handling via RTK Query
* Role-driven UI rendering
* Config-driven dashboards

---

## 📊 Dashboards

Each role has a **config-driven dashboard** with dynamic widgets:

* KPI Cards
* Pie Charts
* Bar Charts
* Line Charts

Widgets load based on role configuration and fetch their own data.

---

## 🗂️ Folder Structure

```
src/
├── api/
├── auth/
├── layout/
├── modules/
│   ├── operations/
│   ├── leadership/
│   ├── management/
│   ├── audits/
│   ├── tickets/
│   └── admin/
├── components/
├── utils/
└── store/
```

---

## 🛠️ Tech Stack

* **React (Latest)**
* **Redux Toolkit**
* **RTK Query**
* **React Hook Form + Zod**
* **DaisyUI + Tailwind CSS**
* **Recharts**
* **React Router**

---

## 🔐 Security & Permissions

* Role-based route protection
* Permission-driven menu rendering
* Component-level access control
* Protected workflows

---

## 🕒 Timeline & Auditability

Each ticket maintains a full history of actions:

* Role
* Action
* Comment
* Timestamp

This provides complete audit trail and traceability.

---

## ⚡ Performance Engineering

* Lazy loaded dashboards
* React.memo for heavy components
* Memoized selectors
* Optimized re-renders
* Prepared for large datasets (10k+ rows)

---

## 🧪 Demo Data

The project currently uses **JSON Server** for demo data.

---

## ▶️ How to Run

1. Install dependencies

   ```bash
   npm install
   ```

2. Start JSON Server

   ```bash
   npx json-server --watch db.json --port 5000
   ```

3. Start frontend

   ```bash
   npm run dev
   ```

---

## 📄 Documentation

Detailed documentation is available in the `docs/` folder:

* Architecture
* State Management
* Workflow Design
* Security
* Performance

---

## 🌱 Future Enhancements

* File attachments
* SLA tracking & escalation
* Notification system
* AI-assisted insights
* Advanced audit reporting

---

## 🏁 Conclusion

IEODP is built as a **real enterprise workflow platform**, not a demo UI. It demonstrates complex workflows, multi-role collaboration, auditability, and scalable architecture.

---

## 👨‍💻 Author

Developed by **Tumma Venkata Sai (Frontend Engineer)**

---

## 📜 License

This project is created for educational and assessment purposes.
