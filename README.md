# 📝 Todo List Microservices

A daily checklist / assignment tracker built with **microservices architecture** using Spring Boot, Spring Cloud, and a modern vanilla JS frontend.

![App Screenshot](msatodo.png)

---

## 🏗️ Architecture

```
┌─────────────┐       ┌──────────────────┐       ┌─────────────────────┐
│   Frontend   │──────▶│   API Gateway    │──────▶│ Assignment Service  │
│  (HTML/JS)   │       │   (Port 8081)    │       │    (Port 8082)      │
└─────────────┘       └──────────────────┘       └─────────┬───────────┘
                              │                            │
                              │                            ▼
                      ┌───────▼──────────┐        ┌──────────────┐
                      │ Service Registry │        │   MySQL DB   │
                      │  Eureka (8761)   │        │  (Port 3307) │
                      └──────────────────┘        └──────────────┘
                              │
                      ┌───────▼──────────┐
                      │  User Service    │
                      │   (Port 8083)    │
                      └──────────────────┘
```

### Services

| Service | Port | Description |
|---------|------|-------------|
| **Service Registry** | `8761` | Eureka server for service discovery |
| **API Gateway** | `8081` | Spring Cloud Gateway — routes requests & handles CORS |
| **Assignment Service** | `8082` | CRUD operations for assignments/tasks |
| **User Service** | `8083` | User registration and management |
| **MySQL** | `3307` | Persistent storage for assignments |

---

## ⚙️ Tech Stack

- **Backend** — Java 17, Spring Boot 3.3.5, Spring Cloud 2023.0.3
- **Service Discovery** — Netflix Eureka
- **API Gateway** — Spring Cloud Gateway (Reactive)
- **Database** — MySQL 8
- **ORM** — Spring Data JPA, Hibernate
- **Frontend** — HTML5, CSS3, Vanilla JavaScript, Chart.js
- **Containerization** — Docker, Docker Compose

---

## 🚀 Getting Started

### Prerequisites

- Java 17+
- Maven 3.8+
- MySQL 8 (or Docker)
- Docker & Docker Compose (optional)

### Option 1 — Run with Docker Compose

```bash
docker-compose up --build
```

This starts all services:
- Eureka Dashboard → [http://localhost:8761](http://localhost:8761)
- API Gateway → [http://localhost:8081](http://localhost:8081)
- Assignment Service → [http://localhost:8082](http://localhost:8082)

### Option 2 — Run Manually

**1. Start MySQL**

Ensure MySQL is running on port `3306` with a database named `assignment_db`.

```sql
CREATE DATABASE assignment_db;
```

**2. Start services in order**

```bash
# 1. Service Registry
cd service-registry
./mvnw spring-boot:run

# 2. Assignment Service
cd assignment-service
./mvnw spring-boot:run

# 3. User Service
cd user-service
./mvnw spring-boot:run

# 4. API Gateway
cd api-gateway
./mvnw spring-boot:run
```

**3. Open the frontend**

Open `index.html` in your browser.

---

## 📡 API Endpoints

### Assignments (`via Gateway: /assignment-service/assignments`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/assignments` | Get all assignments |
| `GET` | `/assignments/{id}` | Get assignment by ID |
| `POST` | `/assignments` | Create a new assignment |
| `PUT` | `/assignments/{id}/complete` | Mark assignment as completed |
| `DELETE` | `/assignments/{id}` | Delete an assignment |

**Example — Create Assignment:**

```json
POST /assignment-service/assignments
{
  "title": "Complete MSA Lab",
  "description": "Finish microservices assignment",
  "dueDate": "2026-07-20",
  "status": "Pending"
}
```

### Users (`/users`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/users/register` | Register a new user |
| `GET` | `/users` | Get all users |

---

## 🖥️ Frontend Features

- **Dashboard** — Overview cards showing total, pending, and overdue assignments
- **Assignment Table** — View, complete, or delete assignments
- **Analytics** — Interactive charts (Bar & Pie) powered by Chart.js
- **Notifications** — Bell badge showing pending/overdue count
- **Modern UI** — Elegant dark-themed design with smooth animations

---

## 📁 Project Structure

```
Todo-List-Microservices/
├── api-gateway/                 # Spring Cloud Gateway
│   └── src/main/
│       ├── java/.../ApiGatewayApplication.java
│       └── resources/application.properties
├── assignment-service/          # Assignment CRUD Service
│   └── src/main/java/.../
│       ├── controller/AssignmentController.java
│       ├── model/Assignment.java
│       ├── repository/AssignmentRepository.java
│       └── service/AssignmentService.java
├── user-service/                # User Management Service
│   └── src/main/java/.../
│       ├── controller/UserController.java
│       ├── model/User.java
│       ├── repository/UserRepository.java
│       └── service/UserService.java
├── service-registry/            # Eureka Server
│   └── src/main/java/.../ServiceRegistryApplication.java
├── index.html                   # Frontend UI
├── style.css                    # Styles
├── script.js                    # Frontend logic
├── docker-compose.yml           # Docker orchestration
└── README.md
```

---

## 🐳 Docker

Each microservice has its own `Dockerfile`. The `docker-compose.yml` orchestrates:

- **mysql_db** — MySQL 8 database
- **eureka_server** — Service Registry
- **assignment_service** — Assignment Service (depends on Eureka + MySQL)
- **api_gateway** — API Gateway (depends on Eureka + Assignment Service)

---

## 📄 License

This project is for educational purposes.
