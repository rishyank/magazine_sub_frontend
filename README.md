# Magazine Subscription Frontend

## Overview

This is a frontend web application built with **React**, **TypeScript**, **Vite**, and **ShadCN UI**, designed for managing magazine subscriptions. It communicates with a backend service built using **Spring Boot** and **MySQL**.

## Features

- User registration and login
- Magazine browsing and search
- Subscription to magazines
- Plan management
- User profile and subscription overview
- Public and protected routes with route guards
- Responsive UI using ShadCN and Radix UI components

## Loom Walkthroughs

- [Loom Video 1 – Application Overview](https://www.loom.com/share/de5c862b3a0f432fb42fd6b7b5c54196?sid=4033d2f2-1542-4dda-9660-4ec64db5d09e)
- [Loom Video 2 – Feature Walkthrough](https://www.loom.com/share/acb156995c9b40039c61ecd3324887b0?sid=4c8936d1-bcf4-48d6-968b-4306bc9085ef)

## Tech Stack

- **Frontend**: React, TypeScript, Vite, TailwindCSS, ShadCN UI, React Router
- **Backend**: Spring Boot (Java), MySQL
- **Authentication**: JWT Token-based (assumed via API endpoints)

## Getting Started

### Prerequisites

- Node.js >= 18.x
- npm or yarn
- Java 17+
- MySQL 8+

### Installation

1. Clone the repository:

```bash
   git clone <repository-url>
   cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Run the app in development mode:

```bash
npm run dev
```

4. Make sure the backend is running and accessible via the configured API base URL.

---

## Available Scripts

- `npm run dev` – Starts the development server
- `npm run build` – Builds the app for production
- `npm run build:dev` – Builds the app in development mode

License
This project is licensed under the MIT License.
