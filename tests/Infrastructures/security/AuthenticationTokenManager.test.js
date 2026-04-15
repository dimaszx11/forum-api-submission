const AuthenticationTokenManager = require('../../../src/Applications/security/AuthenticationTokenManager');

describe('AuthenticationTokenManager interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const tokenManager = new AuthenticationTokenManager();

    // Action & Assert
    await expect(tokenManager.createAccessToken('')).rejects.toThrowError('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
    await expect(tokenManager.createRefreshToken('')).rejects.toThrowError('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
    await expect(tokenManager.verifyRefreshToken('')).rejects.toThrowError('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
    
    // TAMBAHKAN INI UNTUK MENGHIJAUKAN COVERAGE
    await expect(tokenManager.verifyAccessToken('')).rejects.toThrowError('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
    
    await expect(tokenManager.decodePayload('')).rejects.toThrowError('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  });
});