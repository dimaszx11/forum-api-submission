const jwt = require('jsonwebtoken');
const InvariantError = require('../../../src/Commons/exceptions/InvariantError');
const JwtTokenManager = require('../../../src/Infrastructures/security/JwtTokenManager');

describe('JwtTokenManager', () => {
  beforeAll(() => {
    process.env.ACCESS_TOKEN_KEY = 'access_token_secret_test';
    process.env.REFRESH_TOKEN_KEY = 'refresh_token_secret_test';
  });

  describe('createAccessToken function', () => {
    it('should create access token correctly', async () => {
      // Arrange
      const payload = { id: 'user-123' };
      const jwtTokenManager = new JwtTokenManager();

      // Action
      const accessToken = await jwtTokenManager.createAccessToken(payload.id);

      // Assert
      const decodedPayload = jwt.decode(accessToken);
      expect(decodedPayload.id).toEqual(payload.id);
    });
  });

  describe('createRefreshToken function', () => {
    it('should create refresh token correctly', async () => {
      // Arrange
      const payload = { id: 'user-123' };
      const jwtTokenManager = new JwtTokenManager();

      // Action
      const refreshToken = await jwtTokenManager.createRefreshToken(payload.id);

      // Assert
      const decodedPayload = jwt.decode(refreshToken);
      expect(decodedPayload.id).toEqual(payload.id);
    });
  });

  describe('verifyRefreshToken function', () => {
    it('should throw InvariantError when verification failed', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager();
      const accessToken = await jwtTokenManager.createAccessToken('user-123');

      // Action & Assert
      await expect(jwtTokenManager.verifyRefreshToken(accessToken))
        .rejects.toThrowError(InvariantError);
    });

    it('should not throw InvariantError when verification success', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager();
      const refreshToken = await jwtTokenManager.createRefreshToken('user-123');

      // Action & Assert
      await expect(jwtTokenManager.verifyRefreshToken(refreshToken))
        .resolves.not.toThrowError(InvariantError);
    });
  });

  describe('decodePayload function', () => {
    it('should decode payload correctly', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager();
      const refreshToken = await jwtTokenManager.createRefreshToken('user-123');

      // Action
      const { id: userId } = await jwtTokenManager.decodePayload(refreshToken);

      // Assert
      expect(userId).toEqual('user-123');
    });

    // --- PENAMBAHAN UNTUK MENGHIJAUKAN BARIS 33 ---
    it('should throw InvariantError when decode payload failed', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager();
      const invalidToken = 'token_ngawur';

      // Action & Assert
      await expect(jwtTokenManager.decodePayload(invalidToken))
        .rejects.toThrowError(InvariantError);
    });
  });
});