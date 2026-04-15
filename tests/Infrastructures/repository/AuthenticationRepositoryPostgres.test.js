const AuthenticationsTableTestHelper = require('../../helpers/AuthenticationsTableTestHelper');
const InvariantError = require('../../../src/Commons/exceptions/InvariantError');
const pool = require('../../../src/Infrastructures/database/postgres/pool');
const AuthenticationRepositoryPostgres = require('../../../src/Infrastructures/repository/AuthenticationRepositoryPostgres');

describe('AuthenticationRepositoryPostgres', () => {
  afterEach(async () => {
    await AuthenticationsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addToken function', () => {
    it('should add token to database', async () => {
      // Arrange
      const authenticationRepositoryPostgres = new AuthenticationRepositoryPostgres(pool);
      const token = 'token';

      // Action
      await authenticationRepositoryPostgres.addToken(token);

      // Assert: State Verification (Cek langsung ke tabel database)
      const tokens = await AuthenticationsTableTestHelper.findToken(token);
      expect(tokens).toHaveLength(1);
      expect(tokens[0].token).toBe(token);
    });
  });

  describe('checkAvailabilityToken function', () => {
    it('should throw InvariantError when token not available', async () => {
      // Arrange
      const authenticationRepositoryPostgres = new AuthenticationRepositoryPostgres(pool);
      const token = 'token';

      // Action & Assert
      // Nama method harus checkAvailabilityToken agar sinkron dengan repository
      await expect(authenticationRepositoryPostgres.checkAvailabilityToken(token))
        .rejects.toThrowError(InvariantError);
    });

    it('should not throw InvariantError when token available', async () => {
      // Arrange
      const authenticationRepositoryPostgres = new AuthenticationRepositoryPostgres(pool);
      const token = 'token';
      await AuthenticationsTableTestHelper.addToken(token);

      // Action & Assert
      await expect(authenticationRepositoryPostgres.checkAvailabilityToken(token))
        .resolves.not.toThrowError(InvariantError);
    });
  });

  describe('deleteToken function', () => {
    it('should delete token from database', async () => {
      // Arrange
      const authenticationRepositoryPostgres = new AuthenticationRepositoryPostgres(pool);
      const token = 'token';
      await AuthenticationsTableTestHelper.addToken(token);

      // Action
      await authenticationRepositoryPostgres.deleteToken(token);

      // Assert: State Verification (Pastikan data benar-benar hilang dari DB)
      const tokens = await AuthenticationsTableTestHelper.findToken(token);
      expect(tokens).toHaveLength(0);
    });
  });
});