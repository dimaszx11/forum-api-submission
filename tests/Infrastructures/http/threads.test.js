const request = require('supertest');
const createApp = require('../../../src/createApp');
const { cleanupDatabase, closePool } = require('../../helpers/TestHelper');

const app = createApp();

describe('Threads endpoints', () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await closePool();
  });

  const registerAndLogin = async () => {
    const userPayload = {
      username: 'user_http_test',
      password: 'password123',
      fullname: 'HTTP Tester',
    };

    await request(app).post('/users').send(userPayload);
    const loginResponse = await request(app).post('/authentications').send({
      username: userPayload.username,
      password: userPayload.password,
    });

    return loginResponse.body.data.accessToken;
  };

  describe('when POST /threads', () => {
    it('should create thread correctly', async () => {
      const accessToken = await registerAndLogin();
      const response = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'sebuah thread', body: 'sebuah body thread' });

      expect(response.statusCode).toBe(201);
      expect(response.body.status).toBe('success');
    });

    it('should response 400 when request payload not contain needed property', async () => {
      const accessToken = await registerAndLogin();
      const response = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'sebuah thread' });

      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe('fail');
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should response 404 when thread not found', async () => {
      const response = await request(app).get('/threads/thread-999');

      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe('fail');
    });

    it('should response 200 and show thread detail correctly', async () => {
      const accessToken = await registerAndLogin();
      const addThreadRes = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'judul', body: 'isi' });
      
      const { id: threadId } = addThreadRes.body.data.addedThread;

      const response = await request(app).get(`/threads/${threadId}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.thread).toBeDefined();
    });
  });

  // --- BAGIAN KRUSIAL UNTUK MENGHIJAUKAN AUTH MIDDLEWARE ---
  describe('Authentication Security', () => {
    it('should response 401 when header authorization is missing', async () => {
      const response = await request(app).post('/threads').send({ title: 'a', body: 'b' });
      
      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe('Missing authentication');
    });

    it('should response 401 when authorization scheme is not Bearer', async () => {
      // Memicu (scheme !== 'Bearer') pada branch middleware
      const response = await request(app)
        .post('/threads')
        .set('Authorization', 'Basic dXNlcjpwYXNz')
        .send({ title: 'a', body: 'b' });

      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe('format autentikasi tidak valid');
    });

    it('should response 401 when token is missing after Bearer', async () => {
      // Memicu (!token) pada branch middleware
      const response = await request(app)
        .post('/threads')
        .set('Authorization', 'Bearer ') // Spasi tanpa token
        .send({ title: 'a', body: 'b' });

      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe('format autentikasi tidak valid');
    });

    it('should response 401 when access token is invalid', async () => {
      const response = await request(app)
        .post('/threads')
        .set('Authorization', 'Bearer token_ngasal_banget')
        .send({ title: 'a', body: 'b' });

      expect(response.statusCode).toBe(401);
      expect(response.body.status).toBe('fail');
    });
  });

  describe('General Routing', () => {
    it('should response 404 when request to unidentified route', async () => {
      const response = await request(app).get('/route-yang-tidak-mungkin-ada');
      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe('fail');
      expect(response.body.message).toBe('resource tidak ditemukan');
    });
  });
});