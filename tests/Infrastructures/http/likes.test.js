const request = require('supertest');
const createApp = require('../../../src/createApp');
const { cleanupDatabase, closePool } = require('../../helpers/TestHelper');

const app = createApp();

describe('/threads/{threadId}/comments/{commentId}/likes endpoint', () => {
  afterEach(async () => {
    await cleanupDatabase();
    // Jika cleanupDatabase belum membersihkan tabel comment_likes, 
    // pastikan helper tersebut diperbarui atau tambahkan manual di sini.
  });

  afterAll(async () => {
    await closePool();
  });

  const registerAndLogin = async (username = 'like_tester') => {
    const userPayload = {
      username,
      password: 'password123',
      fullname: 'Like Tester',
    };

    await request(app).post('/users').send(userPayload);
    const loginResponse = await request(app).post('/authentications').send({
      username: userPayload.username,
      password: userPayload.password,
    });

    return loginResponse.body.data.accessToken;
  };

  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should response 200 and success status', async () => {
      // Arrange
      const accessToken = await registerAndLogin();
      
      // 1. Buat Thread
      const threadRes = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'thread title', body: 'thread body' });
      const { id: threadId } = threadRes.body.data.addedThread;

      // 2. Buat Komentar
      const commentRes = await request(app)
        .post(`/threads/${threadId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'sebuah komentar' });
      const { id: commentId } = commentRes.body.data.addedComment;

      // Action: Like komentar
      const response = await request(app)
        .put(`/threads/${threadId}/comments/${commentId}/likes`)
        .set('Authorization', `Bearer ${accessToken}`);

      // Assert
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe('success');
    });

    it('should response 401 when missing authentication', async () => {
      // Action
      const response = await request(app)
        .put('/threads/thread-123/comments/comment-123/likes');

      // Assert
      expect(response.statusCode).toBe(401);
    });

    it('should response 404 when thread or comment not found', async () => {
      // Arrange
      const accessToken = await registerAndLogin();

      // Action
      const response = await request(app)
        .put('/threads/thread-999/comments/comment-999/likes')
        .set('Authorization', `Bearer ${accessToken}`);

      // Assert
      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe('fail');
    });
  });
});