const request = require('supertest');
const createApp = require('../../../src/createApp');
const { cleanupDatabase, closePool } = require('../../helpers/TestHelper');

const app = createApp();

describe('/authentications endpoint', () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await closePool();
  });

  describe('when POST /authentications', () => {
    it('should return 201 and access token', async () => {
      await request(app).post('/users').send({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });

      const requestPayload = {
        username: 'dicoding',
        password: 'secret_password',
      };

      const response = await request(app).post('/authentications').send(requestPayload);

      expect(response.statusCode).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
    });

    it('should return 400 when payload not contain needed property', async () => {
      const response = await request(app).post('/authentications').send({ username: 'dicoding' });

      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe('fail');
    });
  });

  describe('when PUT /authentications', () => {
    it('should return 200 and new access token', async () => {
      await request(app).post('/users').send({
        username: 'user_put', password: 'password', fullname: 'fullname',
      });
      const loginRes = await request(app).post('/authentications').send({
        username: 'user_put', password: 'password',
      });
      const { refreshToken } = loginRes.body.data;

      const response = await request(app).put('/authentications').send({ refreshToken });

      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.accessToken).toBeDefined();
    });

    // --- TAMBAHKAN INI UNTUK MENGHIJAUKAN next(error) ---
    it('should response 400 when payload not contain refresh token', async () => {
      const response = await request(app).put('/authentications').send({});

      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe('fail');
    });

    it('should response 400 when refresh token not string', async () => {
      const response = await request(app).put('/authentications').send({ refreshToken: 123 });

      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe('fail');
    });
  });

  describe('when DELETE /authentications', () => {
    it('should return 200 and status success', async () => {
      await request(app).post('/users').send({
        username: 'user_delete', password: 'password', fullname: 'fullname',
      });
      const loginRes = await request(app).post('/authentications').send({
        username: 'user_delete', password: 'password',
      });
      const { refreshToken } = loginRes.body.data;

      const response = await request(app).delete('/authentications').send({ refreshToken });

      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe('success');
    });

    // --- TAMBAHKAN INI UNTUK MENGHIJAUKAN next(error) ---
    it('should response 400 when payload not contain refresh token', async () => {
      const response = await request(app).delete('/authentications').send({});

      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe('fail');
    });

    it('should response 400 when refresh token not string', async () => {
      const response = await request(app).delete('/authentications').send({ refreshToken: 123 });

      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe('fail');
    });
  });
});