const request = require('supertest');
const createApp = require('../../../src/createApp');
const { cleanupDatabase, closePool } = require('../../helpers/TestHelper');

const app = createApp();

describe('/threads/{threadId}/comments endpoint', () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await closePool();
  });

  const registerAndLogin = async (username = 'comment_tester') => {
    const userPayload = {
      username,
      password: 'password123',
      fullname: 'Comment Tester',
    };

    await request(app).post('/users').send(userPayload);
    const loginResponse = await request(app).post('/authentications').send({
      username: userPayload.username,
      password: userPayload.password,
    });

    return loginResponse.body.data.accessToken;
  };

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted comment', async () => {
      const accessToken = await registerAndLogin();
      const threadResponse = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'thread title', body: 'thread body' });
      
      const { id: threadId } = threadResponse.body.data.addedThread;

      const response = await request(app)
        .post(`/threads/${threadId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'sebuah komentar' });

      expect(response.statusCode).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data.addedComment).toBeDefined();
    });

    it('should response 400 when payload bad request', async () => {
      const accessToken = await registerAndLogin();
      
      // PERBAIKAN: Buat thread dulu agar tidak kena 404 'thread tidak ditemukan'
      const threadResponse = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'thread title', body: 'thread body' });
      const { id: threadId } = threadResponse.body.data.addedThread;

      const response = await request(app)
        .post(`/threads/${threadId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({}); // Konten kosong sekarang akan memicu 400 InvariantError

      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe('fail');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 200 and success status', async () => {
      const accessToken = await registerAndLogin();
      const threadRes = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'title', body: 'body' });
      const { id: threadId } = threadRes.body.data.addedThread;

      const commentRes = await request(app)
        .post(`/threads/${threadId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'comment' });
      const { id: commentId } = commentRes.body.data.addedComment;

      const response = await request(app)
        .delete(`/threads/${threadId}/comments/${commentId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe('success');
    });

    it('should response 404 when delete non-existent comment', async () => {
      const accessToken = await registerAndLogin();
      const response = await request(app)
        .delete('/threads/thread-999/comments/comment-999')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe('fail');
    });

    it('should response 403 when delete comment by non-owner', async () => {
      const accessTokenA = await registerAndLogin('user_a');
      const threadRes = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessTokenA}`)
        .send({ title: 't', body: 'b' });
      const { id: threadId } = threadRes.body.data.addedThread;

      const commentRes = await request(app)
        .post(`/threads/${threadId}/comments`)
        .set('Authorization', `Bearer ${accessTokenA}`)
        .send({ content: 'c' });
      const { id: commentId } = commentRes.body.data.addedComment;

      const accessTokenB = await registerAndLogin('user_b');
      const response = await request(app)
        .delete(`/threads/${threadId}/comments/${commentId}`)
        .set('Authorization', `Bearer ${accessTokenB}`);

      expect(response.statusCode).toBe(403);
      expect(response.body.status).toBe('fail');
    });
    
    it('should response 401 when missing authentication', async () => {
      const response = await request(app).delete('/threads/t-1/comments/c-1');
      expect(response.statusCode).toBe(401);
    });
  });
});