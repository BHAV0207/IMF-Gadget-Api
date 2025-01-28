# Gadget Management Backend

This project is a backend service designed for managing gadgets efficiently. It provides a comprehensive set of RESTful API endpoints to perform CRUD operations, authenticate users, and manage gadgets with advanced features like self-destruct sequences.

## Overview

The Gadget Management Backend is built to facilitate the management of gadgets with key features like authentication using JWT tokens, Redis-based caching for optimized performance, and a unique self-destruct feature. It ensures secure and seamless operations tailored for scalable applications.

**Postman Collection:** [Postman Collection Link](-----------)

---

## Features

- Add, update, delete, and retrieve gadgets
- JWT-based authentication for secure access
- Redis caching for faster data retrieval
- Self-destruct feature for gadgets
- Filter gadgets by status
- Robust and scalable design with PostgreSQL integration

---

## Tech Stack

- **Backend Framework:** Node.js (Express.js)
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Tokens)
- **Caching:** Redis (K/V)
- **Utilities:** Random name/code generator for gadgets
- **Environment Management:** dotenv
- **Development Tools:** Nodemon, Postman

---

## API Endpoints

### Gadget Endpoints

1. **Retrieve all gadgets**

   - **GET /api/gadgets**
   - Description: Retrieves all gadgets with their mission success probability.

2. **Add a new gadget**

   - **POST /api/gadgets**
   - Description: Adds a new gadget.
   - Request Body: `{ "name": "GadgetName" }`

3. **Update gadget details**

   - **PATCH /api/gadgets/:id**
   - Description: Updates a gadget's name or status.
   - Authentication: Required.

4. **Decommission a gadget**

   - **DELETE /api/gadgets/:id**
   - Description: Marks a gadget as decommissioned.
   - Authentication: Required.

5. **Initiate self-destruct sequence**

   - **POST /api/gadgets/:id/self-destruct**
   - Description: Starts a self-destruct sequence for a gadget.
   - Authentication: Required.

6. **Retrieve gadgets by status**
   - **GET /api/gadgets/status?status=**
   - Description: Retrieves gadgets filtered by their status.

---

## Redis Caching Implementation

To enhance performance and reduce database load, Redis is used to cache responses for all `GET` requests.

### Cache Key Logic

- **General Cache Key Structure:**  
  `gadget:<key>:<value>`  
  Example: `gadget:status:active`, `gadget:id:123`

- **All Gadgets Cache:**  
  `gadgets:all`

- Cached responses are automatically invalidated when relevant data is modified via `POST`, `PATCH`, or `DELETE` operations.

### Cache Expiry

- All cached responses have an expiry time of **1 hour** (3600 seconds) to ensure data freshness.

### Cache Invalidation

- **On Adding Gadgets:**  
  The `gadgets:all` cache is invalidated.

- **On Updating Gadgets:**  
  Both the `gadgets:all` cache and the specific gadget cache (`gadget:id:<id>`) are invalidated.

- **On Decommissioning Gadgets:**  
  Relevant cache keys are invalidated to ensure consistency.

## Local Setup

Follow these steps to set up the project locally:

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Environment Variables

Create a `.env` file in the `Backend` directory with the following variables:

```plaintext
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
PORT=your_port_number
```

### 4. Start the Server

```bash
npm start
```

The server will start on the port specified in the `.env` file (default: `3000`).

### 5. Development Mode

For development, use `nodemon` to automatically restart the server on file changes:

```bash
npm run dev
```

---

## Middleware

- **Authentication Middleware:** Ensures that requests are authenticated by validating JWT tokens and checking user permissions.

---

## Models

- **Gadget Model:**
  - `id`: Unique identifier for the gadget
  - `name`: Name of the gadget
  - `status`: Current status of the gadget
  - `decommissionedAt`: Timestamp for when the gadget was decommissioned

---

## Utilities

- **Random Utilities:** Functions to generate random gadget names, unique codes, and mission success probabilities.

---

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.
