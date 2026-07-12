# API‑Testing‑Tool 🛠️

A lightweight **Postman‑clone** built with a **Spring Boot** backend and a **React + Vite** frontend. It now includes **environment variable support**, request history, theme toggling, and a polished UI.

---

## Table of Contents
1. [Project Overview](#overview)
2. [Prerequisites](#prereqs)
3. [Setup – Local Development](#setup)
4. [Running the Application](#run)
5. [Deploying to Production](#deploy)
6. [Environment Variables Feature](#env-feature)
7. [Troubleshooting](#troubleshoot)
8. [Repository Structure](#structure)
9. [License](#license)

---

<a name="overview"></a>
## 1️⃣ Project Overview

| Layer | Tech Stack | Key Responsibilities |
|-------|------------|----------------------|
| **Backend** | Spring Boot 3.2.0, PostgreSQL, JPA/Hibernate, Maven | CRUD for collections & requests, execution endpoint (`/execute`), history persistence, OpenAPI docs |
| **Frontend** | React 18, Vite, TailwindCSS, Axios, React‑Context | UI, request editor, response viewer, history page, environment management, theme toggling |
| **Features** | – | • Collections & request management <br> • Request history <br> • Dark/emerald theme <br> • **Environment variables** (`{{var}}` substitution) <br> • Settings UI for environments |

---

<a name="prereqs"></a>
## 2️⃣ Prerequisites

| Tool | Minimum Version |
|------|-----------------|
| **Java** | JDK 17 (or higher) |
| **Maven** | 3.8+ |
| **Node.js** | v20.x (or higher) |
| **npm** | 10.x (comes with Node) |
| **PostgreSQL** | 15.x (default DB for the backend) |
| **Git** | any recent version |

> **Note:** The backend now runs on **port 8090** (configurable in `application.properties`). The Vite dev server proxies `/api` to this port.

---

<a name="setup"></a>
## 3️⃣ Setup – Local Development

### 3.1 Clone the repository
```bash
git clone https://github.com/javvajishalini/API-Testing-Tool.git
cd API-Testing-Tool
```

### 3.2 Backend – configure the database
1. Create a PostgreSQL database named `api_testing_tool` (or change the URL in `src/main/resources/application.properties`).
2. Ensure the user `postgres` with password `password` has access (or update the credentials in the same file).
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/api_testing_tool
spring.datasource.username=postgres
spring.datasource.password=password
```

### 3.3 Backend – start the server
```bash
cd api-testing-backend
./mvnw.cmd spring-boot:run   # Windows
# or
./mvnw spring-boot:run       # macOS / Linux
```
You should see:
```
Tomcat initialized with port 8090 (http)
Started ApiTestingApplication in X.XX seconds
```

### 3.4 Frontend – install dependencies
```bash
cd ../api-testing-frontend
npm install
```

### 3.5 Frontend – start Vite dev server
```bash
npm run dev
```
Vite runs on **http://localhost:5173** and proxies `/api/*` to **http://localhost:8090** (configured in `vite.config.js`).

---

<a name="run"></a>
## 4️⃣ Running the Application (Development)

| URL | Description |
|-----|-------------|
| `http://localhost:5173` | Frontend UI (React) |
| `http://localhost:5173/api/swagger-ui.html` | Swagger UI for backend API |
| `http://localhost:8090/api/v3/api-docs` | OpenAPI JSON |

**Quick sanity check** – open the browser console → Network tab → request `GET /api/collections`. You should receive a **200 OK** response (empty array or persisted collections).

---

<a name="deploy"></a>
## 5️⃣ Deploying to Production

### 5.1 Backend (Spring Boot)
1. **Build the JAR**
```bash
cd api-testing-backend
./mvnw.cmd clean package   # Windows
# or
./mvnw clean package
```
The executable JAR appears at `target/api-testing-backend-0.0.1-SNAPSHOT.jar`.
2. **Configure production properties** (e.g., `application-prod.properties`). Example:
```properties
server.port=8080                 # any free port on the host
spring.datasource.url=jdbc:postgresql://<DB_HOST>:5432/api_testing_tool
spring.datasource.username=your_user
spring.datasource.password=your_pass
```
3. **Run the JAR** (preferably behind a process manager such as `systemd` on Linux or a Windows Service):
```bash
java -jar target/api-testing-backend-0.0.1-SNAPSHOT.jar \
     --spring.config.location=classpath:/application-prod.properties
```
4. **Docker alternative** – a Dockerfile is provided:
```dockerfile
FROM eclipse-temurin:17-jre-alpine
COPY target/api-testing-backend-*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app.jar"]
```
Build & run:
```bash
docker build -t api-testing-backend .
docker run -p 8080:8080 api-testing-backend
```

### 5.2 Frontend (Vite)
1. **Create a production build**
```bash
cd api-testing-frontend
npm run build
```
The output is placed in `dist/`.
2. **Serve the static files**
- **Nginx** (Linux/macOS)
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    root /path/to/api-testing-frontend/dist;
    index index.html;

    location /api/ {
        proxy_pass http://backend-host:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```
- **Apache**
```apache
ProxyPass /api/ http://backend-host:8080/api/
ProxyPassReverse /api/ http://backend-host:8080/api/

DocumentRoot "/path/to/api-testing-frontend/dist"
```
- **Simple Node static server**
```bash
npx serve -s dist -l 5000
```
3. **Configure the proxy** (if the backend lives on a different port/domain, adjust `vite.config.js` before building). The production build does not use the Vite proxy; the reverse‑proxy (NGINX/Apache) should forward `/api/*` to the backend.

---

<a name="env-feature"></a>
## 6️⃣ Environment Variables Feature

| UI Location | Purpose |
|------------|---------|
| **Settings → Environments** | Create / edit / delete named environments (e.g., *Local*, *Production*). Each environment holds key‑value pairs. |
| **Navbar → Env dropdown** | Switch active environment on the fly – all subsequent requests will use the selected env. |
| **Request editor** | Use placeholders like `{{baseUrl}}` in URL, headers, query params, or body. They are resolved just before the request is sent. |

**Example**
1. In **Settings** add an environment named **Local** with variable `baseUrl = http://localhost:8080`.
2. Select **Local** from the navbar dropdown.
3. In the request editor set URL to `{{baseUrl}}/todos/1`.
4. Click **Send** – the engine substitutes `{{baseUrl}}` with `http://localhost:8080` automatically.

> **Tip:** Store auth tokens, API keys, or any reusable value as environment variables and reference them as `{{token}}`.

---

<a name="troubleshoot"></a>
## 7️⃣ Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| **Web server failed to start. Port 8080/8090 already in use.** | Another process is bound to the same port. | 1️⃣ Run `netstat -ano | findstr :8090` (or `:8080`). <br>2️⃣ Kill the PID: `taskkill /PID <PID> /F`. <br>3️⃣ Restart the backend. |
| **Frontend cannot load collections (404/Failed to fetch).** | Vite proxy still points to old port. | Update `vite.config.js` → `target: 'http://localhost:8090'` (or the correct backend port) and restart Vite. |
| **`taskkill` reports “process not found”.** | The PID you tried to kill no longer exists. Re‑run `netstat` to get the current PID. |
| **Backend startup aborts with “Terminate batch job (Y/N)?”** | A previous Maven run was interrupted. Ensure no stray Java processes are running and retry. |
| **Environment variables not resolving.** | No active environment selected, or variable name typo. | Verify the env dropdown in the navbar shows the correct environment, and that the placeholder syntax matches the variable key exactly (`{{key}}`). |
| **CSS/Tailwind errors** | `@tailwind` directives still present in `src/index.css`. | Use plain CSS or adjust Tailwind config; the project now uses custom CSS variables instead. |

---

<a name="structure"></a>
## 8️⃣ Repository Structure
```
API-Testing-Tool/
├─ api-testing-backend/
│   ├─ src/main/java/com/apitester/...   # Controllers, Services, Entities
│   ├─ src/main/resources/
│   │   └─ application.properties       # Backend config (port, DB, etc.)
│   └─ pom.xml                           # Maven build
├─ api-testing-frontend/
│   ├─ src/
│   │   ├─ components/                  # Layout, Navbar, RequestEditor, ResponseViewer
│   │   ├─ contexts/
│   │   │   ├─ ThemeContext.jsx
│   │   │   └─ EnvironmentContext.jsx   # New env context
│   │   ├─ pages/
│   │   │   ├─ Dashboard.jsx
│   │   │   ├─ History.jsx
│   │   │   ├─ Settings.jsx            # Environments UI
│   │   │   └─ Home.jsx
│   │   └─ services/api.js               # Axios instance (baseURL: '/api')
│   ├─ tailwind.config.js                # Tailwind config
│   ├─ vite.config.js                    # Proxy to backend (port 8090)
│   └─ package.json
└─ README.md (this file)
```

---

<a name="license"></a>
## 9️⃣ License

This project is released under the **MIT License** – feel free to fork, modify, and use it in your own applications.

---

## 🎉 You’re all set!
1. **Local development** – run the backend (`./mvnw.cmd spring-boot:run`) and the frontend (`npm run dev`).
2. **Production** – build the backend JAR, configure a production `application‑prod.properties`, and serve the built frontend (`npm run build`) via a static web server or reverse proxy.
3. **Enjoy the Environment Variables** – define environments in Settings, switch them in the Navbar, and watch your requests automatically resolve `{{placeholders}}`.

If you run into any issues or want to add more features (e.g., authentication, import/export of collections, CI/CD pipelines), just let me know!
