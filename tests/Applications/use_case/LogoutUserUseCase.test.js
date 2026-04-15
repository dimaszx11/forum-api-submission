const AuthenticationRepository = require('../../../src/Domains/authentications/AuthenticationRepository');
const LogoutUserUseCase = require('../../../src/Applications/use_case/LogoutUserUseCase');

describe('LogoutUserUseCase', () => {
  it('should orchestrating the logout user action correctly', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 'refreshToken',
    };

    /** creating dependency of use case */
    const mockAuthenticationRepository = new AuthenticationRepository();

    /** mocking needed function */
    mockAuthenticationRepository.checkAvailabilityToken = jest.fn(() => Promise.resolve());
    mockAuthenticationRepository.deleteToken = jest.fn(() => Promise.resolve());

    /** creating use case instance */
    const logoutUserUseCase = new LogoutUserUseCase({
      authenticationRepository: mockAuthenticationRepository,
    });

    // Action
    await logoutUserUseCase.execute(useCasePayload);

    // Assert
    expect(mockAuthenticationRepository.checkAvailabilityToken)
      .toHaveBeenCalledWith(useCasePayload.refreshToken);
    expect(mockAuthenticationRepository.deleteToken)
      .toHaveBeenCalledWith(useCasePayload.refreshToken);
  });

  it('should throw error when payload not contain refresh token', async () => {
    // Arrange
    const logoutUserUseCase = new LogoutUserUseCase({});

    // Action & Assert
    await expect(logoutUserUseCase.execute({}))
      .rejects.toThrowError('DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN');
  });

  it('should throw error when refresh token not string', async () => {
    // Arrange
    const logoutUserUseCase = new LogoutUserUseCase({});

    // Action & Assert
    await expect(logoutUserUseCase.execute({ refreshToken: 123 }))
      .rejects.toThrowError('DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
});