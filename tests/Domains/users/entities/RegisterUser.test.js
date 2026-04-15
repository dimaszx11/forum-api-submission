const RegisterUser = require('../../../../src/Domains/users/entities/RegisterUser');

describe('a RegisterUser entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      username: 'abc',
      password: 'password123',
    };

    expect(() => new RegisterUser(payload)).toThrowError('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      username: 123,
      fullname: 'abc',
      password: 'password123',
    };

    expect(() => new RegisterUser(payload)).toThrowError('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when username contains more than 50 character', () => {
    const payload = {
      username: 'dicodingdicodingdicodingdicodingdicodingdicodingdicoding',
      fullname: 'dicoding',
      password: 'password123',
    };

    expect(() => new RegisterUser(payload)).toThrowError('REGISTER_USER.USERNAME_LIMIT_CHAR');
  });

  it('should throw error when username contains restricted character', () => {
    const payload = {
      username: 'dico ding',
      fullname: 'dicoding',
      password: 'password123',
    };

    expect(() => new RegisterUser(payload)).toThrowError('REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER');
  });

  // Tambahkan test case ini karena di programmu ada validasi minimal 6 karakter
  it('should throw error when password contains less than 6 character', () => {
    const payload = {
      username: 'dicoding',
      fullname: 'dicoding',
      password: 'abc', // Ini yang memicu error di log kamu tadi
    };

    expect(() => new RegisterUser(payload)).toThrowError('REGISTER_USER.PASSWORD_LIMIT_CHAR');
  });

  it('should create registerUser object correctly', () => {
    const payload = {
      username: 'dicoding',
      fullname: 'Dicoding Indonesia',
      password: 'password123', // Minimal 6 karakter agar PASS
    };

    const { username, fullname, password } = new RegisterUser(payload);

    expect(username).toEqual(payload.username);
    expect(fullname).toEqual(payload.fullname);
    expect(password).toEqual(payload.password);
  });
});