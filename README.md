# Nova Club — Campus Events Platform

Nova Club is a modern campus club events platform built with **React, TypeScript, Vite, and Tailwind CSS**.

The platform allows students to discover upcoming college events, search and filter events, view detailed event information, check seat availability, and register for events. It also provides an **Admin Portal** where administrators can manage events and registrations through a dedicated dashboard.

---

## 🚀 Features

### 👨‍🎓 Student / Public Side

* 🏠 Modern home page
* ⭐ Featured event section
* ⏳ Featured-event countdown
* 📅 Browse upcoming campus events
* 🔎 Search events by name
* 🏷️ Filter events by category
* 📆 Filter events by date
* 📄 Detailed event pages
* 📋 Event rules and information
* 💺 Real-time seat availability based on stored registration data
* 📝 Event registration form
* ✅ Form validation
* 🚫 Duplicate-email validation
* ⏰ Registration deadline validation
* 👥 Event capacity validation

### 🔐 Admin Portal

Admin dashboard is available at:

```text
/admin
```

Admin features include:

* 🔑 Admin login
* 📊 Dashboard statistics
* ➕ Create new events
* ✏️ Edit existing events
* 🗑️ Delete events
* 🖼️ Event image presets
* 📋 View registrations
* 🔄 Update registration status
* 📈 Manage event and registration data

### 🗄️ Data Layer

The project uses an asynchronous data layer:

```text
src/services/api.ts
```

The current implementation uses **localStorage** for data persistence.

The API layer is designed to be **swappable**, meaning a real backend/database can be connected later without requiring major changes to the React components.

---

## 🛠️ Tech Stack

### Frontend

* React 18
* TypeScript
* Vite
* Tailwind CSS v3
* React Router v6
* Lucide React

### Data Storage

* Browser localStorage
* Async API abstraction through `src/services/api.ts`

### Deployment

* Netlify
* Vercel

---

## 📂 Project Structure

A simplified project structure looks like this:

```text
nova-club/
│
├── public/
│   └── _redirects
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   │   └── api.ts
│   ├── App.tsx
│   └── main.tsx
│
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vercel.json
└── README.md
```

---

## ⚙️ Getting Started

Follow these steps to run Nova Club locally.

### 1. Clone or download the project

Open the project folder in **VS Code**.

Then open the VS Code terminal:

```text
Terminal → New Terminal
```

### 2. Install dependencies

Run:

```bash
npm install
```

This installs all required packages from `package.json`.

### 3. Start the development server

Run:

```bash
npm run dev
```

Vite will start the development server.

Open the URL shown in the terminal, normally:

```text
http://localhost:5173
```

---

## 🏗️ Production Build

To create a production-ready build:

```bash
npm run build
```

This performs the required type checking/build process and generates the production files inside:

```text
dist/
```

---

## 👀 Preview Production Build

After creating the production build, you can preview it locally using:

```bash
npm run preview
```

---

## 🔐 Demo Admin Credentials

Use the following credentials to access the demo admin portal:

| Field    | Value                |
| -------- | -------------------- |
| Email    | `admin@novaclub.edu` |
| Password | `admin123`           |

Admin dashboard:

```text
/admin
```

> **Note:** These are demo credentials for the project and should not be used for a real production system.

---

## 🌐 Deployment

Nova Club is configured as a **Static SPA (Single Page Application)** and can be deployed to platforms such as **Netlify** or **Vercel**.

### Netlify

Use:

```text
Build command:
npm run build
```

Publish directory:

```text
dist
```

The SPA fallback is handled using:

```text
public/_redirects
```

This allows routes such as `/events/...` to work correctly after deployment.

### Vercel

The project includes:

```text
vercel.json
```

The rewrite configuration keeps deep links such as:

```text
/events/xyz
```

working correctly when the page is refreshed directly.

---

## 🔄 How the Data Flow Works

The application separates UI components from the data layer.

```text
React Components
       ↓
src/services/api.ts
       ↓
localStorage
```

The current implementation stores data in the browser using localStorage.

In the future, the data layer can be changed to:

```text
React Components
       ↓
src/services/api.ts
       ↓
Backend API
       ↓
Database
```

This makes it easier to migrate the project from a demo/local application to a full-stack application.

---

## 📋 Registration Validation

The registration system checks important conditions before accepting a registration:

### Duplicate Email

A student cannot register for the same event multiple times using the same email.

### Registration Deadline

Registrations are rejected after the configured registration deadline.

### Event Capacity

Registrations are prevented when the event reaches its maximum capacity.

This helps maintain accurate seat availability.

---

## 🎯 Project Goals

Nova Club is designed to simplify the management of college club events by providing a single platform for:

* Discovering campus events
* Managing event information
* Registering students
* Tracking available seats
* Managing registrations
* Updating registration status
* Providing administrators with useful dashboard statistics

---

## 🔮 Future Improvements

The current project uses localStorage for demonstration purposes. Possible future improvements include:

* 🔐 Real authentication
* 🗄️ Cloud database
* 🌐 REST API / backend
* 📧 Email registration confirmations
* 🔔 Event notifications
* 👤 Student accounts
* 🛡️ Role-based authorization
* 📊 Advanced admin analytics
* ☁️ Cloud image storage
* 📱 Improved mobile experience

---

## 📜 License

This project was created as a campus/college event management project.

You are free to modify and extend it for learning and project development purposes.

Static SPA — deploys as-is to Netlify or Vercel.

- **Netlify:** build command `npm run build`, publish directory `dist`.
  The SPA fallback is handled by `public/_redirects`.
- **Vercel:** the rewrite in `vercel.json` keeps deep links like `/events/xyz`
  working on hard refresh.
