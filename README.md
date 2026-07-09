# APIFlow — Lightweight API Testing Tool

<div align="center">

  ![APIFlow Banner](https://img.shields.io/badge/APIFlow-API%20Testing%20Tool-6366f1?style=for-the-badge&logo=lightning&logoColor=white)
  
  **A sleek, full-stack Postman alternative built with Spring Boot and React.**

  ![Java](https://img.shields.io/badge/Java-21-ED8B00?style=flat-square&logo=openjdk&logoColor=white)
  ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-6DB33F?style=flat-square&logo=springboot&logoColor=white)
  ![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
  ![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)
  ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=flat-square&logo=postgresql&logoColor=white)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)

</div>

---

## ✨ Features

- 📁 **Collections** — Organize requests into named collections. Create, rename, and delete collections inline.
- 🔍 **Search** — Filter collections and requests by name or URL in real-time.
- ✏️ **Request Editor** — Full HTTP method dropdown (GET/POST/PUT/DELETE/PATCH), URL bar, Params, Headers, and Body tabs with a dynamic key-value editor.
- ⚡ **API Execution Engine** — Backend proxy via `RestTemplate` — sends your configured request to the target server and streams the response back.
- 👁️ **Response Viewer** — Color-coded status badge, response time, size display, pretty JSON formatting with raw/pretty toggle, and a headers table.
- 💾 **Save Requests** — Persist requests (URL, method, headers, params, body) to PostgreSQL. Move requests between collections.
- 🌙 **Dark Mode** — Full dark/light mode toggle with persistence via `localStorage`.
- ✅ **Validation** — URL and JSON body validation on both the frontend and backend.
- 🔔 **Toast Notifications** — Instant success/error notifications for all actions.
- 💀 **Skeleton Loaders** — Smooth loading shimmer for the collections sidebar.

---

## 🗂️ Project Structure

```
API-Testing-Tool/
├── api-testing-backend/       # Spring Boot Backend (Java 21)
│   └── src/main/java/com/apitester/
│       ├── controller/        # REST controllers
│       ├── dto/               # Data Transfer Objects
│       ├── entity/            # JPA Entities
│       ├── exception/         # Global exception handlers
│       ├── repository/        # Spring Data JPA repositories
│       └── service/           # Business logic
│
└── api-testing-frontend/      # React + Vite Frontend
    └── src/
        ├── components/
        │   ├── editor/        # RequestEditor, KeyValueEditor
        │   ├── layout/        # Navbar, Sidebar, MainLayout
        │   └── viewer/        # ResponseViewer
        ├── contexts/          # ThemeContext, AppContext
        ├── pages/             # Dashboard, Settings, NotFound
        └── services/          # api.js (Axios client)
```

---

## 🚀 Prerequisites

Before you begin, ensure you have installed:

| Tool | Version | Download |
|------|---------|----------|
| **JDK** | 21+ | [Adoptium](https://adoptium.net/) |
| **Maven** | 3.8+ | [maven.apache.org](https://maven.apache.org/download.cgi) |
| **Node.js** | 18+ | [nodejs.org](https://nodejs.org/) |
| **PostgreSQL** | 14+ | [postgresql.org](https://www.postgresql.org/download/) |

---

## 🛠️ Setup Guide

### 1. Clone the Repository

```bash
git clone https://github.com/javvajishalini/API-Testing-Tool.git
cd API-Testing-Tool
```

---

### 2. Database Setup (PostgreSQL)

Open a PostgreSQL terminal (e.g., `psql`) and run:

```sql
CREATE DATABASE api_testing_tool;
```

> The schema (tables) will be created automatically by Hibernate on first startup.

---

### 3. Backend Setup (Spring Boot)

#### 3.1 Configure the database connection

Open `api-testing-backend/src/main/resources/application.properties` and update:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/api_testing_tool
spring.datasource.username=postgres
spring.datasource.password=YOUR_PASSWORD_HERE
```

#### 3.2 Build and run the backend

```bash
cd api-testing-backend
./mvnw spring-boot:run
```

> On Windows, use `mvnw.cmd spring-boot:run`

The backend will start at **http://localhost:8080**

✅ Verify it's running: `GET http://localhost:8080/api/collections`

---

### 4. Frontend Setup (React + Vite)

```bash
cd api-testing-frontend
npm install
npm run dev
```

The frontend will start at **http://localhost:5173**

> The Vite dev server proxies all `/api/*` calls to `http://localhost:8080` automatically — no CORS issues.

---

## 🖥️ Usage

1. Open **http://localhost:5173** in your browser.
2. Click the **+** button in the sidebar to create your first **Collection**.
3. Hover over a collection and click **+** to create a **New Request** inside it.
4. Configure the request in the editor:
   - Select the HTTP method (`GET`, `POST`, etc.)
   - Enter the target URL
   - Add query params, headers, or a JSON body in the respective tabs
5. Click **Send** to execute the request. The response (status, time, size, headers, body) will appear on the right.
6. Give the request a name and click **Save** to persist it to the database.

---

## 📡 Backend API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/collections` | List all collections |
| `POST` | `/api/collections` | Create a collection |
| `PUT` | `/api/collections/{id}` | Update a collection |
| `DELETE` | `/api/collections/{id}` | Delete a collection |
| `GET` | `/api/requests?collectionId={id}` | List requests by collection |
| `GET` | `/api/requests/{id}` | Get a single request |
| `POST` | `/api/requests` | Create a request |
| `PUT` | `/api/requests/{id}` | Update a request |
| `DELETE` | `/api/requests/{id}` | Delete a request |
| `POST` | `/api/execute` | Execute an API request (proxy) |

---

## 🧰 Tech Stack

### Backend
- **Java 21** + **Spring Boot 3.2**
- **Spring Data JPA** + **Hibernate** (ORM)
- **Spring Web** — REST API & `RestTemplate` (execution proxy)
- **Spring Validation** — Bean validation
- **PostgreSQL** — Relational database
- **Jackson** — JSON serialization

### Frontend
- **React 18** + **Vite 5**
- **React Router DOM v6** — Client-side routing
- **Axios** — HTTP client
- **Tailwind CSS 3** — Utility-first styling
- **react-hot-toast** — Toast notifications
- **react-icons** — Icon library
- **Inter** + **JetBrains Mono** — Google Fonts

---

## 🤝 Contributing

Pull requests and issues are welcome! Please open an issue first to discuss what you would like to change.

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).
