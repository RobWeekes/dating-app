/**
 * Authentication Routes Tests
 * Tests for user registration, login, and token management
 */
const request = require('supertest');
const express = require('express');
const { User } = require('../models');
const authRoutes = require('./auth');

// Create a test Express app
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

// Clean up database before tests
beforeEach(async () => {
  // Mock users for testing
});

describe('Authentication Routes', () => {
  describe('POST /auth/register', () => {
    it('should register a new user with valid credentials', async () => {
      const newUser = {
        email: 'test.user@example.com',
        password: 'TestPassword123!',
        passwordConfirm: 'TestPassword123!',
        firstName: 'Test',
        lastName: 'User',
        age: 25,
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(newUser)
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(newUser.email);
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should reject registration with mismatched passwords', async () => {
      const invalidUser = {
        email: 'test2@example.com',
        password: 'TestPassword123!',
        passwordConfirm: 'DifferentPassword123!',
        firstName: 'Test',
        lastName: 'User',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUser)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Passwords do not match');
    });

    it('should reject registration with weak password', async () => {
      const weakUser = {
        email: 'test3@example.com',
        password: 'weak',
        passwordConfirm: 'weak',
        firstName: 'Test',
        lastName: 'User',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(weakUser)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should reject duplicate email registration', async () => {
      const user = {
        email: 'duplicate@example.com',
        password: 'TestPassword123!',
        passwordConfirm: 'TestPassword123!',
        firstName: 'Test',
        lastName: 'User',
      };

      // First registration
      await request(app)
        .post('/api/auth/register')
        .send(user)
        .expect(201);

      // Duplicate registration
      const response = await request(app)
        .post('/api/auth/register')
        .send(user)
        .expect(409);

      expect(response.body.error).toContain('Email already registered');
    });

    it('should reject registration with missing required fields', async () => {
      const incompleteUser = {
        email: 'incomplete@example.com',
        password: 'TestPassword123!',
        // Missing passwordConfirm, firstName, lastName
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(incompleteUser)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      // Create a test user
      const user = {
        email: 'login.test@example.com',
        password: 'LoginTest123!',
        passwordConfirm: 'LoginTest123!',
        firstName: 'Login',
        lastName: 'Test',
      };
      await request(app)
        .post('/api/auth/register')
        .send(user);
    });

    it('should login user with valid credentials', async () => {
      const credentials = {
        email: 'login.test@example.com',
        password: 'LoginTest123!',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(credentials)
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(credentials.email);
      expect(response.body.message).toBe('Login successful');
    });

    it('should reject login with invalid email', async () => {
      const credentials = {
        email: 'nonexistent@example.com',
        password: 'LoginTest123!',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(credentials)
        .expect(401);

      expect(response.body.error).toContain('Invalid email or password');
    });

    it('should reject login with incorrect password', async () => {
      const credentials = {
        email: 'login.test@example.com',
        password: 'WrongPassword123!',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(credentials)
        .expect(401);

      expect(response.body.error).toContain('Invalid email or password');
    });

    it('should reject login with missing email', async () => {
      const credentials = {
        password: 'LoginTest123!',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(credentials)
        .expect(400);

      expect(response.body.error).toContain('Email and password are required');
    });

    it('should reject login with missing password', async () => {
      const credentials = {
        email: 'login.test@example.com',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(credentials)
        .expect(400);

      expect(response.body.error).toContain('Email and password are required');
    });

    it('should return a valid JWT token on successful login', async () => {
      const credentials = {
        email: 'login.test@example.com',
        password: 'LoginTest123!',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(credentials)
        .expect(200);

      const token = response.body.token;
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });
  });

  describe('POST /auth/logout', () => {
    it('should reject logout without authentication token', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .expect(401 || 403); // Should fail without token

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Password Validation', () => {
    it('should enforce password requires uppercase letter', async () => {
      const user = {
        email: 'noupppercase@example.com',
        password: 'testpassword123!',
        passwordConfirm: 'testpassword123!',
        firstName: 'Test',
        lastName: 'User',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(user);

      // Should fail validation or create but error on login with bad password
      expect(response.status).toBeGreaterThanOrEqual(400);
    });

    it('should enforce password requires lowercase letter', async () => {
      const user = {
        email: 'nolowercase@example.com',
        password: 'TESTPASSWORD123!',
        passwordConfirm: 'TESTPASSWORD123!',
        firstName: 'Test',
        lastName: 'User',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(user);

      expect(response.status).toBeGreaterThanOrEqual(400);
    });

    it('should enforce password requires number', async () => {
      const user = {
        email: 'nonumber@example.com',
        password: 'TestPassword!',
        passwordConfirm: 'TestPassword!',
        firstName: 'Test',
        lastName: 'User',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(user);

      expect(response.status).toBeGreaterThanOrEqual(400);
    });

    it('should enforce password requires special character', async () => {
      const user = {
        email: 'nospecial@example.com',
        password: 'TestPassword123',
        passwordConfirm: 'TestPassword123',
        firstName: 'Test',
        lastName: 'User',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(user);

      expect(response.status).toBeGreaterThanOrEqual(400);
    });

    it('should enforce password minimum length of 8 characters', async () => {
      const user = {
        email: 'tooshort@example.com',
        password: 'Test1!',
        passwordConfirm: 'Test1!',
        firstName: 'Test',
        lastName: 'User',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(user);

      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });
});
