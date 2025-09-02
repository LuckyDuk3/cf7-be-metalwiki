const m2s = require('mongoose-to-swagger');
const User = require('./models/user.model');
const Band = require('./models/band.model');

exports.options = {
  openapi: "3.1.0",
  info: {
    title: "MetalWiki API",
    version: "1.0.0",
    description: "API for managing metal bands, users, and authentication for MetalWiki project"
    // contact removed
  },
  servers: [
    { url: "http://localhost:3000", description: "Local server" }
  ],
  components: {
    schemas: {
      User: {
        type: "object",
        properties: {
          _id: { type: "string" },
          username: { type: "string" },
          name: { type: "string" },
          surname: { type: "string" },
          email: { type: "string" },
          role: { type: "string", enum: ["user", "admin"] },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        }
      },
      Band: m2s(Band)
    },
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" }
    }
  },
  security: [{ bearerAuth: [] }],
  tags: [
    { name: "Auth", description: "Authentication routes" },
    { name: "Users", description: "User management routes" },
    { name: "Bands", description: "Band management routes" }
  ],
  paths: {
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: { type: "string" },
                  password: { type: "string" },
                  name: { type: "string" },
                  surname: { type: "string" },
                  email: { type: "string" }
                },
                required: ["username", "password", "name", "surname", "email"]
              }
            }
          }
        },
        responses: {
          201: { description: "User registered successfully" },
          400: { description: "Username or email already exists" }
        }
      }
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: { type: "string" },
                  password: { type: "string" }
                },
                required: ["username", "password"]
              }
            }
          }
        },
        responses: {
          200: { description: "Returns JWT token and user info" },
          401: { description: "Invalid credentials" }
        }
      }
    },
    "/api/users": {
      get: {
        tags: ["Users"],
        summary: "Get all users (admin only)",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "List of users",
            content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/User" } } } }
          },
          403: { description: "Admin access required" }
        }
      }
    },
    "/api/users/{id}": {
      get: {
        tags: ["Users"],
        summary: "Get user by ID",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "User found", content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } } },
          404: { description: "User not found" }
        }
      },
      put: {
        tags: ["Users"],
        summary: "Update a user (authenticated, admin or self)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object", properties: { username: { type: "string" }, name: { type: "string" }, surname: { type: "string" }, email: { type: "string" } } } } }
        },
        responses: { 200: { description: "User updated" }, 403: { description: "Unauthorized" } }
      },
      delete: {
        tags: ["Users"],
        summary: "Delete user (admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "User deleted" }, 403: { description: "Admin access required" } }
      }
    },
    "/api/bands": {
      get: {
        tags: ["Bands"],
        summary: "Get all bands",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "List of bands", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Band" } } } } }
        }
      },
      post: {
        tags: ["Bands"],
        summary: "Create a new band (authenticated)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  genre: { type: "string" },
                  country: { type: "string" },
                  formationYear: { type: "integer" },
                  members: { type: "array", items: { type: "string" } }
                },
                required: ["name", "genre", "country", "formationYear"]
              }
            }
          }
        },
        responses: { 201: { description: "Band created" }, 400: { description: "Validation error" } }
      }
    },
    "/api/bands/{id}": {
      get: {
        tags: ["Bands"],
        summary: "Get band by ID",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Band found", content: { "application/json": { schema: { $ref: "#/components/schemas/Band" } } } }, 404: { description: "Band not found" } }
      },
      put: {
        tags: ["Bands"],
        summary: "Update a band (creator or admin)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object", properties: { name: { type: "string" }, genre: { type: "string" }, country: { type: "string" }, formationYear: { type: "integer" }, members: { type: "array", items: { type: "string" } } } } } }
        },
        responses: { 200: { description: "Band updated" }, 403: { description: "Unauthorized" } }
      },
      delete: {
        tags: ["Bands"],
        summary: "Delete a band (creator or admin)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Band deleted" }, 403: { description: "Unauthorized" } }
      }
    }
  }
};
