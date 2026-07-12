# APIFlow – Lightweight API Testing Tool

![GitHub release (latest by date)](https://img.shields.io/github/v/release/javvajishalini/API-Testing-Tool)
![GitHub stars](https://img.shields.io/github/stars/javvajishalini/API-Testing-Tool?style=social)

**APIFlow** is a modern, open‑source tool for quickly testing RESTful APIs. It provides an intuitive UI for crafting requests, viewing formatted responses, and organizing collections of API calls.

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Running the Application](#running-the-application)
- [Usage](#usage)
- [Future Enhancements](#future-enhancements)
- [License](#license)
- [Author](#author)

---

## Features
- 📡 Send HTTP requests (GET, POST, PUT, PATCH, DELETE)
- 🎨 Beautiful response viewer with JSON formatting, status code, response time, headers & body
- 📂 Collections: save, search & delete requests
- 🛠️ Swagger integration
- 🌙 Dark mode & responsive UI

---

## Tech Stack
**Frontend**: React, Vite, Tailwind CSS, Axios

**Backend**: Spring Boot, Spring Web, Spring Data JPA, PostgreSQL, Maven

---

## Getting Started
### Prerequisites
- **Node.js** (>= 18)
- **Java JDK** (>= 17)
- **Maven**
- **PostgreSQL** instance (default port 5432)

### Backend Setup
```bash
# Clone the repository (if not already)
git clone https://github.com/javvajishalini/API-Testing-Tool.git
cd API-Testing-Tool/api-testing-backend

# Create a PostgreSQL database
createdb api_flow_db

# Update the connection details in src/main/resources/application.properties if needed

# Build and run the backend
mvn clean install
mvn spring-boot:run
```
The backend will start on **http://localhost:8080**.

### Frontend Setup
```bash
cd ../api-testing-frontend
npm install
npm run dev
```
The frontend will be served at **http://localhost:5173** and will proxy API calls to the backend.

---

## Running the Application
1. Start the PostgreSQL server.
2. Run the backend (`mvn spring-boot:run`).
3. In a separate terminal, start the frontend (`npm run dev`).
4. Open a browser and navigate to `http://localhost:5173`.

You can now create new requests, explore response details, and organize them into collections.

---

## Usage
- **Create a Request**: Choose the HTTP method, enter the endpoint URL, add optional headers/body, and hit **Send**.
- **Save to Collections**: Click **Save** to store the request for future reuse.
- **Search Collections**: Use the search bar at the top of the Collections panel.
- **Swagger**: Access the generated Swagger UI at `http://localhost:8080/swagger-ui.html`.

---

## Future Enhancements
- Authentication support (Bearer token, Basic Auth, API Key)
- Environment variable management
- Request history tracking
- Import/Export of collections
- Response analytics dashboards
- Workspace multi‑project support

---

## License
This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

---

## Author
**Shalini** – [GitHub Profile](https://github.com/javvajishalini)

---

*Feel free to star the repository if you find APIFlow useful!*
