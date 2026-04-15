const request = require('supertest');
const createApp = require('../../../src/createApp');
const { cleanupDatabase, closePool } = require('../../helpers/TestHelper');

const app = createApp();

describe('/users endpoint', () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await closePool();
  });

  describe('when POST /users', () => {
    it('should response 201 and persisted user', async () => {
      // Action
      const response = await request(app)
        .post('/users')
        .send({
          username: 'dimaszx',
          password: 'secret_password',
          fullname: 'Muhamad Dimas',
        });

      // Assert
      expect(response.statusCode).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data.addedUser).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      const response = await request(app)
        .post('/users')
        .send({
          username: 'dimaszx',
        }); // password & fullname absen

      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe('fail');
    });

    it('should response 400 when username more than 20 character', async () => {
      const response = await request(app)
        .post('/users')
        .send({
          username: 'dimaszxdimaszxdimaszxdimaszx',
          password: 'secret_password',
          fullname: 'Muhamad Dimas',
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe('fail');
    });

    // --- PENAMBAHAN UNTUK MENGHIJAUKAN BRANCH 500 DI createApp.js ---
    it('should response 500 when server runtime error occurs', async () => {
      const response = await request(app)
        .post('/users')
        .set('Content-Type', 'application/json')
        .send('{"username": "dimaszx",'); // JSON sengaja dibuat rusak (kurang tutup kurung)

      expect(response.statusCode).toBe(500);
      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('terjadi kegagalan pada server kami');
    });
  });
});