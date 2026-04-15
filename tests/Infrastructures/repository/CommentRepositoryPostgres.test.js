const CommentRepositoryPostgres = require('../../../src/Infrastructures/repository/CommentRepositoryPostgres');
const NewComment = require('../../../src/Domains/comments/entities/NewComment');
const pool = require('../../../src/Infrastructures/database/postgres/pool');
const UsersTableTestHelper = require('../../helpers/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../helpers/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../helpers/CommentsTableTestHelper');
const NotFoundError = require('../../../src/Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../src/Commons/exceptions/AuthorizationError');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist new comment and return added comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      
      const newComment = new NewComment({
        content: 'sebuah komentar',
        threadId: 'thread-123',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(newComment);

      // Assert
      expect(addedComment.id).toEqual('comment-123');
      expect(addedComment.content).toEqual(newComment.content);
      expect(addedComment.owner).toEqual(newComment.owner);

      // Verifikasi State Database
      const comment = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comment).toBeDefined();
      expect(comment.id).toEqual('comment-123');
      expect(comment.content).toEqual('sebuah komentar');
    });
  });

  describe('verifyCommentExists function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyCommentExists('comment-123'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when comment found', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyCommentExists('comment-123'))
        .resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-ngasal', 'user-123'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should throw AuthorizationError when comment owner not match', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-456'))
        .rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when comment owner match', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123'))
        .resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('deleteComment function', () => {
    it('should update is_delete column to true when comment deleted', async () => {
      // Arrange
      const commentId = 'comment-123';
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: commentId, isDelete: false });
      
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.deleteComment(commentId);

      // Assert: Verifikasi kolom is_delete (Soft Delete Verification)
      const comment = await CommentsTableTestHelper.findCommentById(commentId);
      expect(comment.is_delete).toEqual(true);
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should return thread comments correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      const commentPayload = {
        id: 'comment-123',
        content: 'sebuah komentar',
        date: new Date().toISOString(),
      };
      await CommentsTableTestHelper.addComment(commentPayload);

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');

      expect(comments).toHaveLength(1);
      expect(comments[0].id).toEqual(commentPayload.id);
      expect(comments[0].username).toEqual('dicoding');
      expect(comments[0].content).toEqual(commentPayload.content);
      expect(comments[0].date).toBeDefined();
    });
  });

  describe('checkLikeExists function', () => {
    it('should return true if like exists', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      // Kita butuh helper untuk likes, atau pakai pool.query langsung
      await pool.query("INSERT INTO comment_likes VALUES('like-123', 'user-123', 'comment-123')");
      const repository = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      const isLiked = await repository.checkLikeExists('comment-123', 'user-123');
      expect(isLiked).toBe(false);
    });

    it('should return false if like not exists', async () => {
      // Arrange
      const repository = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      const isLiked = await repository.checkLikeExists('comment-123', 'user-123');
      expect(isLiked).toBe(false);
    });
  });

  describe('addLike function', () => {
    it('should persist like to database', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      const fakeIdGenerator = () => '123';
      const repository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await repository.addLike('comment-123', 'user-123');

      // Assert
      const result = await pool.query("SELECT * FROM comment_likes WHERE id = 'like-123'");
      expect(result.rows).toHaveLength(1);
    });
  });

  describe('deleteLike function', () => {
    it('should delete like from database', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      await pool.query("INSERT INTO comment_likes VALUES('like-123', 'user-123', 'comment-123')");
      const repository = new CommentRepositoryPostgres(pool, {});

      // Action
      await repository.deleteLike('comment-123', 'user-123');

      // Assert
      const result = await pool.query("SELECT * FROM comment_likes WHERE id = 'like-123'");
      expect(result.rows).toHaveLength(0);
    });
  });
});