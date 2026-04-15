const UsersTableTestHelper = require('../../helpers/UsersTableTestHelper');
const InvariantError = require('../../../src/Commons/exceptions/InvariantError');
const pool = require('../../../src/Infrastructures/database/postgres/pool');
const UserRepositoryPostgres = require('../../../src/Infrastructures/repository/UserRepositoryPostgres');
const RegisterUser = require('../../../src/Domains/users/entities/RegisterUser');
const RegisteredUser = require('../../../src/Domains/users/entities/RegisteredUser');

describe('UserRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyAvailableUsername function', () => {
    it('should throw InvariantError when username not available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(userRepositoryPostgres.verifyAvailableUsername('dicoding'))
        .rejects.toThrowError(InvariantError);
    });

    it('should not throw InvariantError when username available', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(userRepositoryPostgres.verifyAvailableUsername('dicoding'))
        .resolves.not.toThrowError(InvariantError);
    });
  });

  describe('addUser function', () => {
    it('should persist register user and return registered user correctly', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const fakeIdGenerator = () => '123';
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const registeredUser = await userRepositoryPostgres.addUser(registerUser);

      // Assert
      const users = await UsersTableTestHelper.findUsersById('user-123');
      expect(users).toHaveLength(1);
      expect(registeredUser).toStrictEqual(new RegisteredUser({
        id: 'user-123',
        username: 'dicoding',
        fullname: 'Dicoding Indonesia',
      }));
    });
  });

  describe('getPasswordByUsername function', () => {
    it('should throw InvariantError when user not found', async () => {
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      await expect(userRepositoryPostgres.getPasswordByUsername('dicoding'))
        .rejects.toThrowError(InvariantError);
    });

    it('should return user password when user is found', async () => {
      await UsersTableTestHelper.addUser({ username: 'dicoding', password: 'secret_password' });
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      const password = await userRepositoryPostgres.getPasswordByUsername('dicoding');

      expect(password).toBe('secret_password');
    });
  });

  describe('getIdByUsername function', () => {
    it('should throw InvariantError when user not found', async () => {
      // PERBAIKAN: Instansiasi sudah dibersihkan dari typo
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(userRepositoryPostgres.getIdByUsername('dicoding'))
        .rejects.toThrowError(InvariantError);
    });

    it('should return user id when user is found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action
      const userId = await userRepositoryPostgres.getIdByUsername('dicoding');

      // Assert
      expect(userId).toBe('user-123');
    });
  });
});