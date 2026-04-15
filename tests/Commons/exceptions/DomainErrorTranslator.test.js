const DomainErrorTranslator = require('../../../src/Commons/exceptions/DomainErrorTranslator');
const InvariantError = require('../../../src/Commons/exceptions/InvariantError');

describe('DomainErrorTranslator', () => {
  it('should translate error correctly', () => {
    // Test mapping baru: Password limit
    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.PASSWORD_LIMIT_CHAR')))
      .toBeInstanceOf(InvariantError);

    // Test mapping baru: Restricted character login
    expect(DomainErrorTranslator.translate(new Error('LOGIN_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER')))
      .toBeInstanceOf(InvariantError);
  });

  it('should return original error when message not needed to translate', () => {
    // Menguji jika error tidak ada di daftar mapping
    const error = new Error('ANY_ERROR_MESSAGE');
    const translatedError = DomainErrorTranslator.translate(error);

    expect(translatedError).toEqual(error);
  });
});