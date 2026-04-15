// Kurangi satu tingkat ../ jika folder tests kamu sejajar dengan src
const RegisterUser = require('../../../src/Domains/users/entities/RegisterUser');
const RegisteredUser = require('../../../src/Domains/users/entities/RegisteredUser');
const UserRepository = require('../../../src/Domains/users/UserRepository');
const PasswordHash = require('../../../src/Applications/security/PasswordHash');
const AddUserUseCase = require('../../../src/Applications/use_case/AddUserUseCase');

describe('AddUserUseCase', () => {
  it('should orchestrating the add user action correctly', async () => {
    // Arrange
    const useCasePayload = { username: 'dicoding', fullname: 'Dicoding Indonesia', password: 'password123' };
    const mockRegisteredUser = new RegisteredUser({ id: 'user-123', username: 'dicoding', fullname: 'Dicoding Indonesia' });

    /** creating dependency of use case */
    const mockUserRepository = new UserRepository();
    const mockPasswordHash = new PasswordHash();

/** mocking needed function */
    mockUserRepository.verifyAvailableUsername = jest.fn(() => Promise.resolve());
    mockPasswordHash.hash = jest.fn(() => Promise.resolve('hashed_password'));
    
    // Gunakan mockRegisteredUser untuk hasil kembalian repository
    mockUserRepository.addUser = jest.fn(() => Promise.resolve(mockRegisteredUser));

    /** creating use case instance */
    const addUserUseCase = new AddUserUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash,
    });

    /** * Tentukan nilai EXPECTED secara eksplisit
     */
    const expectedRegisteredUser = new RegisteredUser({
      id: 'user-123',
      username: 'dicoding',
      fullname: 'Dicoding Indonesia',
    });
    
    // Action
    const registeredUser = await addUserUseCase.execute(useCasePayload);

// Assert
    // Sekarang kita bandingkan dengan expectedRegisteredUser, bukan mockRegisteredUser
    expect(registeredUser).toStrictEqual(expectedRegisteredUser);
    
    expect(mockUserRepository.verifyAvailableUsername).toBeCalledWith(useCasePayload.username);
    expect(mockPasswordHash.hash).toBeCalledWith(useCasePayload.password);
    expect(mockUserRepository.addUser).toBeCalledWith(new RegisterUser({
      username: useCasePayload.username,
      fullname: useCasePayload.fullname,
      password: 'hashed_password',
    }));
  });
});