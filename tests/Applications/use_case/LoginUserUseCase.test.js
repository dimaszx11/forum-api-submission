const UserRepository = require('../../../src/Domains/users/UserRepository');
const AuthenticationRepository = require('../../../src/Domains/authentications/AuthenticationRepository');
const AuthenticationTokenManager = require('../../../src/Applications/security/AuthenticationTokenManager');
const PasswordHash = require('../../../src/Applications/security/PasswordHash');
const LoginUserUseCase = require('../../../src/Applications/use_case/LoginUserUseCase');
const NewAuth = require('../../../src/Domains/authentications/entities/NewAuth');

describe('LoginUserUseCase', () => {
  it('should orchestrating the login user action correctly', async () => {
    // Arrange
    const useCasePayload = {
      username: 'dicoding',
      password: 'password123',
    };

    const mockNewAuth = new NewAuth({
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    });

    /** creating dependency of use case */
    const mockUserRepository = new UserRepository();
    const mockAuthenticationRepository = new AuthenticationRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();
    const mockPasswordHash = new PasswordHash();

    /** mocking needed function */
    mockUserRepository.getPasswordByUsername = jest.fn(() => Promise.resolve('hashed_password'));
    mockUserRepository.getIdByUsername = jest.fn(() => Promise.resolve('user-123'));
    mockPasswordHash.compare = jest.fn(() => Promise.resolve());
    mockAuthenticationTokenManager.createAccessToken = jest.fn(() => Promise.resolve('access_token'));
    mockAuthenticationTokenManager.createRefreshToken = jest.fn(() => Promise.resolve('refresh_token'));
    mockAuthenticationRepository.addToken = jest.fn(() => Promise.resolve());

    /** creating use case instance */
    const loginUserUseCase = new LoginUserUseCase({
      userRepository: mockUserRepository,
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
      passwordHash: mockPasswordHash,
    });

    // Action
    const actualNewAuth = await loginUserUseCase.execute(useCasePayload);

    // Assert
    expect(actualNewAuth).toStrictEqual(mockNewAuth);
    expect(mockUserRepository.getPasswordByUsername).toBeCalledWith(useCasePayload.username);
    expect(mockPasswordHash.compare).toBeCalledWith(useCasePayload.password, 'hashed_password');
    expect(mockUserRepository.getIdByUsername).toBeCalledWith(useCasePayload.username);
    expect(mockAuthenticationTokenManager.createAccessToken).toBeCalledWith('user-123');
    expect(mockAuthenticationTokenManager.createRefreshToken).toBeCalledWith('user-123');
    expect(mockAuthenticationRepository.addToken).toBeCalledWith('refresh_token');
  });
});