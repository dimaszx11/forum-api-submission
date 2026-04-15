const LoginUser = require('../../../../src/Domains/users/entities/LoginUser');

describe('a LoginUser entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = { username: 'abc' };
    expect(() => new LoginUser(payload)).toThrowError('LOGIN_USER.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  // 1. TAMBAHKAN VALIDASI TIPE DATA
  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      username: 123,
      password: 'abc',
    };
    expect(() => new LoginUser(payload)).toThrowError('LOGIN_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when username contains restricted character', () => {
    const payload = {
      username: 'dico ding',
      password: 'abc',
    };
    expect(() => new LoginUser(payload)).toThrowError('LOGIN_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER');
  });

  // 2. TAMBAHKAN SKENARIO BERHASIL
  it('should create loginUser object correctly', () => {
    // Arrange
    const payload = {
      username: 'dicoding',
      password: 'abc',
    };

    // Action
    const { username, password } = new LoginUser(payload);

    // Assert
    expect(username).toEqual(payload.username);
    expect(password).toEqual(payload.password);
  });
});