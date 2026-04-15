const AuthenticationRepository = require('../../../src/Domains/authentications/AuthenticationRepository');
const AuthenticationTokenManager = require('../../../src/Applications/security/AuthenticationTokenManager');
const RefreshAuthenticationUseCase = require('../../../src/Applications/use_case/RefreshAuthenticationUseCase');

describe('RefreshAuthenticationUseCase', () => {
  it('should orchestrating the refresh authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 'some_refresh_token',
    };

    /** creating dependency of use case */
    const mockAuthenticationRepository = new AuthenticationRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();

    /** mocking needed function */
    mockAuthenticationRepository.checkAvailabilityToken = jest.fn(() => Promise.resolve());
    mockAuthenticationTokenManager.verifyRefreshToken = jest.fn(() => Promise.resolve());
    mockAuthenticationTokenManager.decodePayload = jest.fn(() => Promise.resolve({ username: 'dicoding', id: 'user-123' }));
    mockAuthenticationTokenManager.createAccessToken = jest.fn(() => Promise.resolve('some_new_access_token'));

    /** creating use case instance */
    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    // Action
    const accessToken = await refreshAuthenticationUseCase.execute(useCasePayload);

    // Assert
    expect(mockAuthenticationRepository.checkAvailabilityToken)
      .toHaveBeenCalledWith(useCasePayload.refreshToken);
    expect(mockAuthenticationTokenManager.verifyRefreshToken)
      .toHaveBeenCalledWith(useCasePayload.refreshToken);
    expect(mockAuthenticationTokenManager.decodePayload)
      .toHaveBeenCalledWith(useCasePayload.refreshToken);
    expect(mockAuthenticationTokenManager.createAccessToken)
      .toHaveBeenCalledWith('user-123');
    expect(accessToken).toEqual('some_new_access_token');
  });

  it('should throw error if payload not contain refresh token', async () => {
    // Arrange
    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({});

    // Action & Assert
    await expect(refreshAuthenticationUseCase.execute({}))
      .rejects.toThrowError('REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN');
  });

  it('should throw error if refresh token not string', async () => {
    // Arrange
    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({});

    // Action & Assert
    await expect(refreshAuthenticationUseCase.execute({ refreshToken: 123 }))
      .rejects.toThrowError('REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
});