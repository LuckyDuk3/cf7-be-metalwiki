# CF7 BE MetalWiki

Backend of the MetalWiki application, built with Node.js, Express, and MongoDB.  
Provides REST API with authentication and CRUD operations for bands and users.

---

## Prerequisites

- Node.js v20+  
- npm
- MongoDB (local or Atlas)

---

## Installation

```bash
git clone <repo-url>
cd cf7-be-metalwiki
npm install
```

---

## Environment Setup

Create a `.env` file in the root of the project with the following variables:

- PORT=3000
- MONGO_URI=<your-mongodb-uri>
- JWT_SECRET=<your-secret-key>

---

## Database Seeding. Creates an admin account and populates the database with some initial bands
```bash
node seed.js
```
## Scripts
```bash
npm run start ## Start in production mode

npm run dev ## Start in development mode with watch

npm run test1 ## Run all tests with Jest

npm run test:auth ## Run authentication tests

npm run test:band ## Run band-related tests
```
Note: Running tests will delete data in the database (including the admin account).
If you lose the admin account, simply re-run the seed script.

---

## API Documentation (Swagger)
After starting the server, you can access the Swagger UI at:
http://localhost:3000/api-docs

---

## Technologies

- Node.js 20+
- Express 5
- MongoDB & Mongoose
- JWT Authentication
- Jest & Supertest for testing
- Swagger (swagger-jsdoc & swagger-ui-express) for API documentation