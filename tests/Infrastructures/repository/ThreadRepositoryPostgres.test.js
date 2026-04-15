const ThreadRepositoryPostgres = require('../../../src/Infrastructures/repository/ThreadRepositoryPostgres');
const NewThread = require('../../../src/Domains/threads/entities/NewThread');
const AddedThread = require('../../../src/Domains/threads/entities/AddedThread');
const pool = require('../../../src/Infrastructures/database/postgres/pool');
const UsersTableTestHelper = require('../../helpers/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../helpers/ThreadsTableTestHelper');
const NotFoundError = require('../../../src/Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist add thread and return added thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const newThread = new NewThread({
        title: 'sebuah thread',
        body: 'sebuah body',
        owner: 'user-123',
      });

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(newThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(threads).toHaveLength(1);
      expect(addedThread).toStrictEqual(new AddedThread({
       id: 'thread-123',
       title: 'sebuah thread',
       owner: 'user-123',
      }));
    });
  });

  describe('isThreadExist function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.isThreadExist('thread-404'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when thread found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.isThreadExist('thread-123'))
        .resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('getThreadById function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.getThreadById('thread-404'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should return thread detail correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        owner: 'user-123',
        title: 'sebuah thread',
        body: 'sebuah body',
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, () => 'unused');

      // Action
      const thread = await threadRepositoryPostgres.getThreadById('thread-123');

      // Assert
      expect(thread.id).toBe('thread-123');
      expect(thread.title).toBe('sebuah thread');
      expect(thread.body).toBe('sebuah body');
      expect(thread.username).toBe('dicoding');
      expect(thread.date).toBeDefined();
    });
  });
  
  describe('verifyThreadExists function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadExists('thread-404'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when thread found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadExists('thread-123'))
        .resolves.not.toThrowError(NotFoundError);
    });
  });
});