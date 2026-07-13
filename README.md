# APIFlow – Lightweight API Testing Tool

<div align="center">

![GitHub release (latest by date)](https://img.shields.io/github/v/release/javvajishalini/API-Testing-Tool)
![GitHub stars](https://img.shields.io/github/stars/javvajishalini/API-Testing-Tool?style=social)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Java](https://img.shields.io/badge/Java-17%2B-orange?logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen?logo=springboot)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite)

**A modern, open‑source tool for quickly testing RESTful APIs.**
Craft requests, view formatted responses, and organize collections — all in one place.

</div>

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
  - [System Overview](#system-overview)
  - [Request Execution Flow](#request-execution-flow)
  - [Backend Package Structure](#backend-package-structure)
  - [Frontend Module Structure](#frontend-module-structure)
  - [Database Schema](#database-schema)
- [Project Directory Structure](#project-directory-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Running the Application](#running-the-application)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Future Enhancements](#future-enhancements)
- [License](#license)
- [Author](#author)

---

## Features

| Feature | Description |
|--------|-------------|
| 📡 **HTTP Methods** | Full support for GET, POST, PUT, PATCH, DELETE |
| 🎨 **Response Viewer** | Syntax-highlighted JSON, status code badge, response time, headers & body tabs |
| 📂 **Collections** | Save, search & delete named request collections |
| 🌍 **Environment Contexts** | Switch between environments via `EnvironmentContext` |
| 🛠️ **Swagger UI** | Auto-generated docs at `/swagger-ui.html` |
| 🌙 **Dark Mode** | Full dark/light theme toggle with `ThemeContext` |
| 📜 **Request History** | Browse past API calls via the History page |
| 📊 **Dashboard** | Overview of your testing activity |
| 📱 **Responsive UI** | Works across desktop and tablet viewports |

---

## Tech Stack

### Frontend
| Technology | Role |
|-----------|------|
| **React 18** | UI component framework |
| **Vite 5** | Build tool & dev server with HMR |
| **Tailwind CSS** | Utility-first styling |
| **Axios** | HTTP client for backend communication |
| **React Context API** | Global state (theme, environment, app state) |

### Backend
| Technology | Role |
|-----------|------|
| **Spring Boot 3** | Application framework & auto-configuration |
| **Spring Web** | REST controller layer & `RestTemplate` proxy |
| **Spring Data JPA** | ORM & repository abstraction |
| **PostgreSQL** | Persistent storage for requests & collections |
| **SpringDoc / Swagger UI** | Interactive API documentation |
| **Maven** | Build & dependency management |

---

## Architecture

### System Overview

```mermaid
graph TB
    subgraph Browser["🌐 Browser"]
        UI["React + Vite Frontend\nlocalhost:5173"]
    end

    subgraph Backend["☕ Spring Boot Backend (localhost:8080)"]
        direction TB
        CTRL["Controller Layer\nREST Endpoints"]
        SVC["Service Layer\nBusiness Logic"]
        REPO["Repository Layer\nSpring Data JPA"]
        PROXY["Execution Service\nRestTemplate Proxy"]
    end

    subgraph DB["🐘 PostgreSQL"]
        T1["api_collection"]
        T2["api_request"]
    end

    subgraph External["🌍 External APIs"]
        EXT["Target API Servers"]
    end

    UI -- "Axios HTTP calls" --> CTRL
    CTRL --> SVC
    SVC --> REPO
    REPO --> DB
    SVC --> PROXY
    PROXY -- "Forwards request" --> EXT
    EXT -- "Raw response" --> PROXY
    PROXY -- "Structured JSON" --> UI
```

---

### Request Execution Flow

```mermaid
sequenceDiagram
    actor User
    participant FE as React Frontend
    participant BE as Spring Boot Backend
    participant EXT as External API
    participant DB as PostgreSQL

    User->>FE: Fill method, URL, headers, body
    User->>FE: Click "Send"
    FE->>BE: POST /api/execute {method, url, headers, body}
    BE->>EXT: Forward HTTP request via RestTemplate
    EXT-->>BE: Raw HTTP response (status, headers, body)
    BE-->>FE: ExecutionResponseDto {status, time, headers, body}
    FE->>User: Render syntax-highlighted response

    opt User clicks "Save"
        User->>FE: Click "Save to Collection"
        FE->>BE: POST /api/requests {name, method, url, ...}
        BE->>DB: Persist ApiRequest entity
        DB-->>BE: Saved entity with ID
        BE-->>FE: ApiRequestDto (with ID)
        FE->>User: Show success confirmation
    end
```

---

### Backend Package Structure

```mermaid
graph LR
    Root["com.apitester"] --> CTRL
    Root --> SVC
    Root --> REPO
    Root --> ENT
    Root --> DTO
    Root --> EXC
    Root --> CFG

    CTRL["controller\nApiCollectionController\nApiRequestController\nApiExecutionController"]
    SVC["service\nApiCollectionService\nApiCollectionServiceImpl\nApiRequestService\nApiRequestServiceImpl\nApiExecutionService\nApiExecutionServiceImpl"]
    REPO["repository\nApiCollectionRepository\nApiRequestRepository"]
    ENT["entity\nApiCollection\nApiRequest"]
    DTO["dto\nApiCollectionDto\nApiRequestDto\nExecutionRequestDto\nExecutionResponseDto"]
    EXC["exception\nGlobalExceptionHandler\nCustom Exceptions"]
    CFG["config\nCorsConfig\nRestTemplateConfig"]
```

Each layer has a **single responsibility**:

| Package | Responsibility |
|---------|---------------|
| `controller` | Exposes REST endpoints; maps HTTP ↔ DTOs |
| `service` | Orchestrates business logic; interface + `Impl` pattern |
| `repository` | Spring Data JPA interfaces for DB access |
| `entity` | JPA-annotated domain objects (`@Entity`) |
| `dto` | Serializable request/response shapes (no JPA annotations) |
| `exception` | `@ControllerAdvice` global error handler + custom exceptions |
| `config` | CORS rules, `RestTemplate` bean definition |

---

### Frontend Module Structure

```mermaid
graph TD
    main["main.jsx\nApp entry point"] --> App
    App["App.jsx\nRouter + Context Providers"] --> LAYOUT
    App --> PAGES
    App --> CTX

    CTX["contexts/\nAppContext\nThemeContext\nEnvironmentContext"]
    LAYOUT["components/layout/\nMainLayout\nNavbar\nSidebar"]
    PAGES["pages/\nHome\nDashboard\nHistory\nSettings\nNotFound"]

    LAYOUT --> EDITOR
    LAYOUT --> VIEWER

    EDITOR["components/editor/\nRequestEditor\nKeyValueEditor"]
    VIEWER["components/viewer/\nResponseViewer"]

    PAGES --> SVC
    SVC["services/\napi.js - Axios client"]
```

| Module | Role |
|--------|------|
| `contexts/` | React Context providers for theme, environment, and global app state |
| `components/layout/` | Shell UI — Navbar, collapsible Sidebar, MainLayout wrapper |
| `components/editor/` | Request builder — HTTP method selector, URL bar, headers/body editor |
| `components/viewer/` | Response panel — JSON pretty-print, status badge, timing, headers |
| `pages/` | Route-level views: Home, Dashboard, History, Settings, 404 |
| `services/api.js` | Centralised Axios instance with base URL & interceptors |

---

### Database Schema

```mermaid
erDiagram
    API_COLLECTION {
        BIGINT    id           PK
        VARCHAR   name
        TEXT      description
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    API_REQUEST {
        BIGINT    id             PK
        BIGINT    collection_id  FK
        VARCHAR   name
        VARCHAR   method
        TEXT      url
        TEXT      headers
        TEXT      body
        TIMESTAMP created_at
    }

    API_COLLECTION ||--o{ API_REQUEST : "contains"
```

---

## Project Directory Structure

```
API-Testing-Tool/
├── README.md
├── .gitignore
│
├── api-testing-backend/                    # Spring Boot application
│   ├── pom.xml                             # Maven build descriptor
│   └── src/main/
│       ├── java/com/apitester/
│       │   ├── ApiTestingApplication.java  # @SpringBootApplication entry point
│       │   ├── controller/
│       │   │   ├── ApiCollectionController.java   # /api/collections endpoints
│       │   │   ├── ApiRequestController.java      # /api/requests endpoints
│       │   │   └── ApiExecutionController.java    # /api/execute endpoint
│       │   ├── service/
│       │   │   ├── ApiCollectionService.java      # Interface
│       │   │   ├── ApiCollectionServiceImpl.java  # Implementation
│       │   │   ├── ApiRequestService.java         # Interface
│       │   │   ├── ApiRequestServiceImpl.java     # Implementation
│       │   │   ├── ApiExecutionService.java       # Interface
│       │   │   └── ApiExecutionServiceImpl.java   # RestTemplate proxy logic
│       │   ├── repository/
│       │   │   ├── ApiCollectionRepository.java
│       │   │   └── ApiRequestRepository.java
│       │   ├── entity/
│       │   │   ├── ApiCollection.java             # @Entity: collections table
│       │   │   └── ApiRequest.java                # @Entity: requests table
│       │   ├── dto/
│       │   │   ├── ApiCollectionDto.java
│       │   │   ├── ApiRequestDto.java
│       │   │   ├── ExecutionRequestDto.java       # Inbound execution payload
│       │   │   └── ExecutionResponseDto.java      # Outbound response envelope
│       │   ├── exception/                         # GlobalExceptionHandler + custom errors
│       │   └── config/                            # CorsConfig, RestTemplate bean
│       └── resources/
│           └── application.properties             # DB, port, JPA, Swagger settings
│
└── api-testing-frontend/                   # React + Vite application
    ├── package.json
    ├── vite.config.js                       # Dev proxy: /api → localhost:8080
    ├── tailwind.config.js
    └── src/
        ├── main.jsx                         # ReactDOM entry, wraps context providers
        ├── App.jsx                          # Router + context provider tree
        ├── index.css                        # Global styles + Tailwind layers
        ├── contexts/
        │   ├── AppContext.jsx               # Global app state
        │   ├── ThemeContext.jsx             # Dark/light mode toggle
        │   └── EnvironmentContext.jsx       # Base URL / env variable management
        ├── components/
        │   ├── layout/
        │   │   ├── MainLayout.jsx           # Page shell / grid layout
        │   │   ├── Navbar.jsx               # Top navigation & theme toggle
        │   │   └── Sidebar.jsx              # Collections panel & nav links
        │   ├── editor/
        │   │   ├── RequestEditor.jsx        # Full request builder (method, URL, tabs)
        │   │   └── KeyValueEditor.jsx       # Reusable key-value pair table editor
        │   └── viewer/
        │       └── ResponseViewer.jsx       # Response display with status & JSON tabs
        ├── pages/
        │   ├── Home.jsx                     # Main request/response workspace
        │   ├── Dashboard.jsx                # Activity & statistics overview
        │   ├── History.jsx                  # Past request history browser
        │   ├── Settings.jsx                 # App preferences & configuration
        │   └── NotFound.jsx                 # 404 fallback page
        └── services/
            └── api.js                       # Axios instance (baseURL, default headers)
```

---

## Getting Started

### Prerequisites

| Requirement | Minimum Version |
|------------|----------------|
| Node.js | ≥ 18 |
| Java JDK | ≥ 17 |
| Maven | ≥ 3.8 |
| PostgreSQL | ≥ 14 |

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/javvajishalini/API-Testing-Tool.git
cd API-Testing-Tool/api-testing-backend

# Create a PostgreSQL database
createdb api_flow_db

# Review / update DB credentials
# → src/main/resources/application.properties
#   spring.datasource.url=jdbc:postgresql://localhost:5432/api_flow_db
#   spring.datasource.username=your_user
#   spring.datasource.password=your_password

# Build and run
mvn clean install
mvn spring-boot:run
```

> The backend starts on **http://localhost:8080**.
> Swagger UI is available at **http://localhost:8080/swagger-ui.html**

### Frontend Setup

```bash
cd ../api-testing-frontend
npm install
npm run dev
```

> The frontend is served at **http://localhost:5173**.
> All `/api/*` requests are proxied to the Spring Boot backend via `vite.config.js`.

---

## Running the Application

1. Ensure your **PostgreSQL** server is running.
2. In **Terminal 1** — start the backend:
   ```bash
   cd api-testing-backend
   mvn spring-boot:run
   ```
3. In **Terminal 2** — start the frontend:
   ```bash
   cd api-testing-frontend
   npm run dev
   ```
4. Open **http://localhost:5173** in your browser.

---

## Usage

| Task | How To |
|------|--------|
| **Send a Request** | Select HTTP method → Enter URL → Add headers/body → Click **Send** |
| **Save to Collection** | After a request, click **Save** and choose or create a collection |
| **Browse Collections** | Use the left **Sidebar** to expand collections and load saved requests |
| **Search Collections** | Use the search bar at the top of the Sidebar panel |
| **Switch Theme** | Toggle dark/light mode from the **Navbar** |
| **View History** | Navigate to the **History** page from the Sidebar |
| **Swagger Docs** | Visit `http://localhost:8080/swagger-ui.html` |

---

## API Reference

The backend exposes three groups of REST endpoints:

| Group | Base Path | Description |
|-------|-----------|-------------|
| **Execution** | `POST /api/execute` | Proxy-execute an HTTP request against any external API |
| **Requests** | `/api/requests` | CRUD for saved API request records |
| **Collections** | `/api/collections` | CRUD for named request collections |

Full interactive documentation is available via Swagger UI at:
`http://localhost:8080/swagger-ui.html`

---

## Future Enhancements

- [ ] 🔐 Authentication support (Bearer token, Basic Auth, API Key)
- [ ] 🌍 Environment variable management UI
- [ ] 📜 Persistent request history with pagination
- [ ] 📦 Import / Export collections (Postman JSON, OpenAPI)
- [ ] 📊 Response analytics dashboards (timing charts, status distribution)
- [ ] 🗂️ Workspace / multi-project support
- [ ] 🔄 Pre-request scripts and test assertions
- [ ] 🖥️ Desktop app packaging (Electron / Tauri)

---



## Author

**Shalini** – [GitHub Profile](https://github.com/javvajishalini)

---


