# PingSpyder

PingSpyder is an enterprise-grade network monitoring and reporting platform designed for real-time monitoring, analytics, reporting, and infrastructure observability.

## Repository Structure

```text
pingspyder/
├── backend/     # Spring Boot backend services
├── frontend/    # Frontend application
├── service/     # Python monitoring and processing services
```

---

## Tech Stack

### Backend
- Java 21
- Spring Boot
- MongoDB
- JWT Authentication
- OpenAPI / Swagger

### Frontend
- React
- Vite
- Tailwind CSS

### Monitoring Service
- Python
- FastAPI
- Async Monitoring Engine

---

## Features

- Real-time network monitoring
- PDF report generation
- Monitoring analytics dashboard
- Authentication and role-based access
- Device monitoring integrations
- Dynamic filtering and reporting
- Scalable monorepo architecture

---

## Getting Started

### Clone Repository

```bash
git clone https://github.com/psahu-sos/pingspyder.git
```

---

## Backend Setup

```bash
cd backend
```

Configure environment variables before starting the application.

Run:

```bash
./mvnw spring-boot:run
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## Monitoring Service Setup

```bash
cd service
pip install -r requirements.txt
uvicorn app.main:app --reload
```

---

## Environment Variables

Secrets and credentials are managed using environment variables.

Example:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret
```

---

## Architecture

PingSpyder follows a modular monorepo architecture where:
- backend handles APIs and business logic
- frontend manages UI/UX
- service handles monitoring execution and processing

---

## License

Private/Internal Project